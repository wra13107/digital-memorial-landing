import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, memorials, galleryItems, InsertMemorial, InsertGalleryItem } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

export async function getUserById(id: number | string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const result = await db.select().from(users).where(eq(users.id, numId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMemorial(memorial: InsertMemorial) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(memorials).values(memorial);
  return result;
}

export async function getMemorialsByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(memorials).where(eq(memorials.userId, userId));
}

export async function getMemorialById(id: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(memorials).where(eq(memorials.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateMemorial(id: number, data: Partial<InsertMemorial>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.update(memorials).set(data).where(eq(memorials.id, id));
}

export async function addGalleryItem(item: InsertGalleryItem) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.insert(galleryItems).values(item);
}

export async function getGalleryItemsByMemorialId(memorialId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(galleryItems).where(eq(galleryItems.memorialId, memorialId));
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.delete(galleryItems).where(eq(galleryItems.id, id));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(users);
}

export async function updateUser(id: number | string, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return await db.update(users).set(data).where(eq(users.id, numId));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const userMemorials = await getMemorialsByUserId(id);
  for (const memorial of userMemorials) {
    await db.delete(galleryItems).where(eq(galleryItems.memorialId, memorial.id));
  }
  await db.delete(memorials).where(eq(memorials.userId, id));
  
  return await db.delete(users).where(eq(users.id, id));
}

/**
 * Get user by email for local authentication
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by username for local authentication (admin login)
 */
export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new user with local authentication
 */
export async function createLocalUser(data: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  birthDate?: Date;
  deathDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Generate a unique openId for local users
  const openId = `local_${data.email}_${Date.now()}`;

  await db.insert(users).values({
    openId,
    email: data.email,
    passwordHash: data.passwordHash,
    firstName: data.firstName,
    lastName: data.lastName,
    patronymic: data.patronymic,
    birthDate: data.birthDate,
    deathDate: data.deathDate,
    loginMethod: "local",
    role: "user",
    name: `${data.firstName} ${data.lastName}`,
  });

  // Fetch and return the created user
  const user = await getUserByEmail(data.email);
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
}


/**
 * Update password reset token for a user
 */
export async function setPasswordResetToken(userId: number, token: string, expiry: Date): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(users).set({
    passwordResetToken: token,
    passwordResetExpiry: expiry,
  }).where(eq(users.id, userId));
}

/**
 * Get user by password reset token
 */
export async function getUserByPasswordResetToken(token: string): Promise<typeof users.$inferSelect | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.passwordResetToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Clear password reset token for a user
 */
export async function clearPasswordResetToken(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(users).set({
    passwordResetToken: null,
    passwordResetExpiry: null,
  }).where(eq(users.id, userId));
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: number, passwordHash: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(users).set({
    passwordHash,
  }).where(eq(users.id, userId));
}


/**
 * Set email verification token for a user
 */
export async function setEmailVerificationToken(userId: number, token: string, expiry: Date): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(users).set({
    emailVerificationToken: token,
    emailVerificationExpiry: expiry,
  }).where(eq(users.id, userId));
}

/**
 * Get user by email verification token
 */
export async function getUserByEmailVerificationToken(token: string): Promise<typeof users.$inferSelect | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.emailVerificationToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Mark email as verified for a user
 */
export async function markEmailAsVerified(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(users).set({
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpiry: null,
  }).where(eq(users.id, userId));
}

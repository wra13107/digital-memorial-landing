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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
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

export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.update(users).set(data).where(eq(users.id, id));
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

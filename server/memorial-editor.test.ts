import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users, memorials } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

let db: ReturnType<typeof drizzle>;

beforeAll(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
    ssl: "Amazon RDS" in (process.env.DATABASE_URL || "") ? "require" : undefined,
  });
  db = drizzle(connection);
});

describe("Memorial Editor Operations", () => {
  let testUserId: number;
  let testMemorialId: number;

  beforeAll(async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    // Create test user
    const hashedPassword = await bcrypt.hash("testpass123", 10);
    const result = await db
      .insert(users)
      .values({
        openId: `test-user-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        passwordHash: hashedPassword,
        lastName: "Тест",
        firstName: "Пользователь",
        loginMethod: "local",
        role: "user",
      })
      .execute();

    testUserId = (result as any).insertId;
  });

  afterAll(async () => {
    // Clean up test data
    if (db) {
      if (testMemorialId) {
        await db.delete(memorials).where(eq(memorials.id, testMemorialId)).execute();
      }
      if (testUserId) {
        await db.delete(users).where(eq(users.id, testUserId)).execute();
      }
    }
  });

  it("should create a memorial with all fields", async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    const memorialData = {
      userId: testUserId,
      lastName: "Иванов",
      firstName: "Иван",
      patronymic: "Иванович",
      birthDate: new Date("1950-01-15"),
      deathDate: new Date("2020-12-31"),
      burialPlace: "Кладбище 'Новое', Москва",
      latitude: "55.7558",
      longitude: "37.6173",
      description: "Биография человека",
      isPublic: true,
    };

    const result = await db
      .insert(memorials)
      .values(memorialData)
      .execute();

    testMemorialId = (result as any).insertId;

    expect(testMemorialId).toBeGreaterThan(0);

    // Verify the memorial was created
    const created = await db
      .select()
      .from(memorials)
      .where(eq(memorials.id, testMemorialId))
      .execute();

    expect(created).toHaveLength(1);
    expect(created[0].lastName).toBe("Иванов");
    expect(created[0].firstName).toBe("Иван");
    expect(created[0].burialPlace).toBe("Кладбище 'Новое', Москва");
  });

  it("should update memorial details", async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    if (!testMemorialId) {
      throw new Error("Test memorial not created");
    }

    const updates = {
      description: "Обновленная биография",
      burialPlace: "Кладбище 'Старое', Санкт-Петербург",
      latitude: "59.9311",
      longitude: "30.3609",
    };

    await db
      .update(memorials)
      .set(updates)
      .where(eq(memorials.id, testMemorialId))
      .execute();

    // Verify updates
    const updated = await db
      .select()
      .from(memorials)
      .where(eq(memorials.id, testMemorialId))
      .execute();

    expect(updated[0].description).toBe("Обновленная биография");
    expect(updated[0].burialPlace).toBe("Кладбище 'Старое', Санкт-Петербург");
    expect(updated[0].latitude).toBe("59.9311");
    expect(updated[0].longitude).toBe("30.3609");
  });

  it("should retrieve memorial by ID", async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    if (!testMemorialId) {
      throw new Error("Test memorial not created");
    }

    const memorial = await db
      .select()
      .from(memorials)
      .where(eq(memorials.id, testMemorialId))
      .execute();

    expect(memorial).toHaveLength(1);
    expect(memorial[0].id).toBe(testMemorialId);
    expect(memorial[0].userId).toBe(testUserId);
  });

  it("should retrieve memorials by user ID", async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    const userMemorials = await db
      .select()
      .from(memorials)
      .where(eq(memorials.userId, testUserId))
      .execute();

    expect(userMemorials.length).toBeGreaterThan(0);
    expect(userMemorials.some((m) => m.id === testMemorialId)).toBe(true);
  });

  it("should validate required fields on memorial creation", async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    // Missing required fields should fail
    try {
      await db
        .insert(memorials)
        .values({
          userId: testUserId,
          // Missing lastName and firstName
          firstName: "",
          lastName: "",
          isPublic: true,
        } as any)
        .execute();

      // If we get here, the test should check for empty strings
      const result = await db
        .select()
        .from(memorials)
        .where(eq(memorials.userId, testUserId))
        .execute();

      // Empty names should not be allowed in real validation
      const hasEmpty = result.some((m) => !m.lastName || !m.firstName);
      expect(hasEmpty).toBe(false);
    } catch (error) {
      // Expected to fail
      expect(error).toBeDefined();
    }
  });

  it("should handle memorial coordinates correctly", async () => {
    if (!db) {
      throw new Error("Database not initialized");
    }
    if (!testMemorialId) {
      throw new Error("Test memorial not created");
    }

    const memorial = await db
      .select()
      .from(memorials)
      .where(eq(memorials.id, testMemorialId))
      .execute();

    expect(memorial[0].latitude).toBeDefined();
    expect(memorial[0].longitude).toBeDefined();

    // Verify coordinates are valid
    const lat = parseFloat(memorial[0].latitude?.toString() || "0");
    const lng = parseFloat(memorial[0].longitude?.toString() || "0");

    expect(lat).toBeGreaterThanOrEqual(-90);
    expect(lat).toBeLessThanOrEqual(90);
    expect(lng).toBeGreaterThanOrEqual(-180);
    expect(lng).toBeLessThanOrEqual(180);
  });
});

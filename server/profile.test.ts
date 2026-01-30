import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createLocalUser, getUserById, updateUser } from "./db";
import { hashPassword } from "./auth";

describe("User Profile Operations", () => {
  let testUserId: string;

  beforeAll(async () => {
    // Create a test user
    const passwordHash = await hashPassword("TestPassword123!");
    const result = await createLocalUser({
      email: `profile-test-${Date.now()}@test.com`,
      passwordHash,
      firstName: "Test",
      lastName: "User",
      patronymic: "Testovich",
      birthDate: new Date("1990-01-01"),
      deathDate: new Date("2020-01-01"),
    });
    
    const user = await getUserById(result.id);
    testUserId = user?.id || "";
  });

  afterAll(async () => {
    // Cleanup is handled by database
  });

  it("should retrieve user profile by ID", async () => {
    const user = await getUserById(testUserId);
    
    expect(user).toBeDefined();
    expect(user?.firstName).toBe("Test");
    expect(user?.lastName).toBe("User");
    expect(user?.patronymic).toBe("Testovich");
  });

  it("should update user profile information", async () => {
    await updateUser(testUserId, {
      firstName: "Updated",
      lastName: "Name",
      patronymic: "Patronymic",
    });

    const updatedUser = await getUserById(testUserId);
    
    expect(updatedUser?.firstName).toBe("Updated");
    expect(updatedUser?.lastName).toBe("Name");
    expect(updatedUser?.patronymic).toBe("Patronymic");
  });

  it("should update birth and death dates", async () => {
    const newBirthDate = new Date("1985-05-15");
    const newDeathDate = new Date("2023-06-20");

    await updateUser(testUserId, {
      birthDate: newBirthDate,
      deathDate: newDeathDate,
    });

    const updatedUser = await getUserById(testUserId);
    
    expect(updatedUser?.birthDate).toEqual(newBirthDate);
    expect(updatedUser?.deathDate).toEqual(newDeathDate);
  });

  it("should handle partial profile updates", async () => {
    const originalUser = await getUserById(testUserId);
    
    await updateUser(testUserId, {
      firstName: "PartialUpdate",
    });

    const updatedUser = await getUserById(testUserId);
    
    expect(updatedUser?.firstName).toBe("PartialUpdate");
    expect(updatedUser?.lastName).toBe(originalUser?.lastName);
  });

  it("should preserve email during profile updates", async () => {
    const originalUser = await getUserById(testUserId);
    const originalEmail = originalUser?.email;

    await updateUser(testUserId, {
      firstName: "NewFirst",
      lastName: "NewLast",
    });

    const updatedUser = await getUserById(testUserId);
    
    expect(updatedUser?.email).toBe(originalEmail);
  });

  it("should handle multiple concurrent updates", async () => {
    const updates = [
      updateUser(testUserId, { firstName: "First1" }),
      updateUser(testUserId, { lastName: "Last1" }),
      updateUser(testUserId, { patronymic: "Patron1" }),
    ];

    await Promise.all(updates);

    const finalUser = await getUserById(testUserId);
    
    expect(finalUser?.firstName).toBe("First1");
    expect(finalUser?.lastName).toBe("Last1");
    expect(finalUser?.patronymic).toBe("Patron1");
  });
});

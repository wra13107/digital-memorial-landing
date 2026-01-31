import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createLocalUser, getAllUsers, updateUser, deleteUser, getUserById } from "./db";
import { hashPassword } from "./auth";

describe("Admin User Management", () => {
  let testUserId: number;
  let testUserEmail: string;

  beforeAll(async () => {
    // Create a test user for management tests
    testUserEmail = `test-admin-${Date.now()}@example.com`;
    const passwordHash = await hashPassword("TestPassword123");
    const user = await createLocalUser({
      email: testUserEmail,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up: delete test user if it still exists
    try {
      await deleteUser(testUserId);
    } catch (error) {
      // User might already be deleted
    }
  });

  it("should list all users", async () => {
    const users = await getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    
    // Verify test user is in the list
    const testUser = users.find(u => u.email === testUserEmail);
    expect(testUser).toBeDefined();
    expect(testUser?.id).toBe(testUserId);
  });

  it("should get user by ID", async () => {
    const user = await getUserById(testUserId);
    expect(user).toBeDefined();
    expect(user?.id).toBe(testUserId);
    expect(user?.email).toBe(testUserEmail);
  });

  it("should update user role to admin", async () => {
    const updatedUser = await updateUser(testUserId, { role: "admin" });
    expect(updatedUser).toBeDefined();
    
    // Verify the role was updated
    const user = await getUserById(testUserId);
    expect(user?.role).toBe("admin");
  });

  it("should update user role back to user", async () => {
    const updatedUser = await updateUser(testUserId, { role: "user" });
    expect(updatedUser).toBeDefined();
    
    // Verify the role was updated
    const user = await getUserById(testUserId);
    expect(user?.role).toBe("user");
  });

  it("should delete user", async () => {
    // Create a temporary user to delete
    const tempEmail = `temp-delete-${Date.now()}@example.com`;
    const passwordHash = await hashPassword("TempPassword123");
    const tempUser = await createLocalUser({
      email: tempEmail,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
    });

    // Delete the temporary user
    await deleteUser(tempUser.id);

    // Verify the user is deleted
    const deletedUser = await getUserById(tempUser.id);
    expect(deletedUser).toBeUndefined();
  });

  it("should not find deleted user in users list", async () => {
    // Create and delete a user
    const tempEmail = `temp-list-${Date.now()}@example.com`;
    const passwordHash = await hashPassword("TempPassword123");
    const tempUser = await createLocalUser({
      email: tempEmail,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
    });

    await deleteUser(tempUser.id);

    // Verify user is not in the list
    const users = await getAllUsers();
    const deletedUser = users.find(u => u.id === tempUser.id);
    expect(deletedUser).toBeUndefined();
  });

  it("should update user email", async () => {
    const newEmail = `updated-${Date.now()}@example.com`;
    const updatedUser = await updateUser(testUserId, { email: newEmail });
    expect(updatedUser).toBeDefined();

    // Verify email was updated
    const user = await getUserById(testUserId);
    expect(user?.email).toBe(newEmail);
  });
});

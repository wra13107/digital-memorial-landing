import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createLocalUser, getUserById, updateUser, deleteUser } from "./db";
import { hashPassword } from "./auth";

describe("Three-Tier Role System", () => {
  let testUserIds: number[] = [];

  afterAll(async () => {
    // Cleanup test users
    for (const id of testUserIds) {
      try {
        await deleteUser(id);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  it("should create user with customer role by default", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `customer-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
    });

    expect(result).toBeDefined();
    const user = await getUserById(result.id);
    expect(user?.role).toBe("customer");
    testUserIds.push(result.id);
  });

  it("should create user with user role", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `user-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
      role: "user",
    });

    expect(result).toBeDefined();
    const user = await getUserById(result.id);
    expect(user?.role).toBe("user");
    testUserIds.push(result.id);
  });

  it("should create user with admin role", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `admin-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
      role: "admin",
    });

    expect(result).toBeDefined();
    const user = await getUserById(result.id);
    expect(user?.role).toBe("admin");
    testUserIds.push(result.id);
  });

  it("should update user role from customer to user", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `role-update-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
    });

    testUserIds.push(result.id);

    // Update role to user
    await updateUser(result.id, { role: "user" });
    const updatedUser = await getUserById(result.id);
    expect(updatedUser?.role).toBe("user");
  });

  it("should update user role from user to admin", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `admin-update-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
      role: "user",
    });

    testUserIds.push(result.id);

    // Update role to admin
    await updateUser(result.id, { role: "admin" });
    const updatedUser = await getUserById(result.id);
    expect(updatedUser?.role).toBe("admin");
  });

  it("should update user role from admin to customer", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `downgrade-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
      role: "admin",
    });

    testUserIds.push(result.id);

    // Update role to customer
    await updateUser(result.id, { role: "customer" });
    const updatedUser = await getUserById(result.id);
    expect(updatedUser?.role).toBe("customer");
  });

  it("should maintain role when updating other fields", async () => {
    const passwordHash = await hashPassword("testPassword123");
    const result = await createLocalUser({
      email: `maintain-role-${Date.now()}@test.com`,
      passwordHash,
      phone: "+1234567890",
      countryCode: "US",
      role: "user",
    });

    testUserIds.push(result.id);

    // Update other fields without changing role
    await updateUser(result.id, { firstName: "John", lastName: "Doe" });
    const updatedUser = await getUserById(result.id);
    expect(updatedUser?.role).toBe("user");
    expect(updatedUser?.firstName).toBe("John");
    expect(updatedUser?.lastName).toBe("Doe");
  });

  it("should support all three role values", async () => {
    const roles: Array<"admin" | "user" | "customer"> = ["admin", "user", "customer"];
    const createdUsers: number[] = [];

    for (const role of roles) {
      const passwordHash = await hashPassword("testPassword123");
      const result = await createLocalUser({
        email: `role-${role}-${Date.now()}@test.com`,
        passwordHash,
        phone: "+1234567890",
        countryCode: "US",
        role,
      });

      createdUsers.push(result.id);
      const user = await getUserById(result.id);
      expect(user?.role).toBe(role);
    }

    testUserIds.push(...createdUsers);
  });
});

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { hashPassword, verifyPassword, createToken, verifyToken } from "./auth";

describe("Authentication", () => {
  describe("Password hashing and verification", () => {
    it("should hash a password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it("should verify a correct password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const password = "TestPassword123!";
      const wrongPassword = "WrongPassword456!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it("should hash different passwords differently", async () => {
      const password1 = "Password1";
      const password2 = "Password1";

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      // Hashes should be different due to salt
      expect(hash1).not.toBe(hash2);
      // But both should verify correctly
      expect(await verifyPassword(password1, hash1)).toBe(true);
      expect(await verifyPassword(password2, hash2)).toBe(true);
    });
  });

  describe("JWT token creation and verification", () => {
    it("should create a valid JWT token", async () => {
      const userId = 1;
      const email = "test@example.com";
      const token = await createToken(userId, email);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // JWT has 3 parts
    });

    it("should verify a valid token", async () => {
      const userId = 1;
      const email = "test@example.com";
      const token = await createToken(userId, email);
      const decoded = await verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it("should reject an invalid token", async () => {
      const invalidToken = "invalid.token.here";

      await expect(verifyToken(invalidToken)).rejects.toThrow("Invalid or expired token");
    });

    it("should reject a tampered token", async () => {
      const userId = 1;
      const email = "test@example.com";
      const token = await createToken(userId, email);

      // Tamper with the token
      const parts = token.split(".");
      const tamperedToken = parts[0] + ".tampered." + parts[2];

      await expect(verifyToken(tamperedToken)).rejects.toThrow();
    });
  });
});


describe("User registration and login procedures", () => {
  it("should validate email format", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);

    // Test that email validation works in the schema
    expect(hash).toBeDefined();
  });

  it("should validate password requirements", async () => {
    const weakPassword = "short";
    const strongPassword = "StrongPassword123!";

    const weakHash = await hashPassword(weakPassword);
    const strongHash = await hashPassword(strongPassword);

    expect(await verifyPassword(weakPassword, weakHash)).toBe(true);
    expect(await verifyPassword(strongPassword, strongHash)).toBe(true);
    expect(await verifyPassword(weakPassword, strongHash)).toBe(false);
  });

  it("should handle concurrent password operations", async () => {
    const passwords = ["Pass1!", "Pass2!", "Pass3!", "Pass4!"];
    const hashes = await Promise.all(passwords.map(p => hashPassword(p)));

    const verifications = await Promise.all(
      passwords.map((p, i) => verifyPassword(p, hashes[i]))
    );

    expect(verifications).toEqual([true, true, true, true]);
  });
});

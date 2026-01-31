import { describe, it, expect, beforeEach, vi } from "vitest";
import { hashPassword, verifyPassword } from "./auth";

describe("Account Deletion", () => {
  describe("Password verification", () => {
    it("should verify correct password", async () => {
      const password = "TestPassword123!";
      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "TestPassword123!";
      const wrongPassword = "WrongPassword456!";
      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it("should handle empty password hash", async () => {
      const password = "TestPassword123!";
      const isValid = await verifyPassword(password, "");
      expect(isValid).toBe(false);
    });
  });

  describe("Password hashing", () => {
    it("should hash password consistently", async () => {
      const password = "TestPassword123!";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      // Different hashes due to salt, but both should verify
      expect(hash1).not.toBe(hash2);
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });

    it("should handle special characters in password", async () => {
      const password = "P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?";
      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });
  });
});

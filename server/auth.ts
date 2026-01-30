import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import cookie from "cookie";

const SALT_ROUNDS = 10;
const COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY = "7d";

// Get JWT secret from environment
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token
 */
export async function createToken(userId: number, email: string): Promise<string> {
  const secret = getJWTSecret();
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<{ userId: number; email: string }> {
  const secret = getJWTSecret();
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: number; email: string };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Create a cookie with the JWT token
 */
export function createAuthCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`;
}

/**
 * Parse auth token from cookies
 */
export function getAuthTokenFromCookies(cookieHeader: string): string | null {
  const parsed = cookie.parse(cookieHeader || "");
  return parsed[COOKIE_NAME] || null;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

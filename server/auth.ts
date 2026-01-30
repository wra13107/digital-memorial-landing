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
 * @param userId - User ID
 * @param email - User email
 * @param isAdmin - Whether this is an admin token (10-minute expiry)
 */
export async function createToken(userId: number, email: string, isAdmin: boolean = false): Promise<string> {
  const secret = getJWTSecret();
  const expiryTime = isAdmin ? "10m" : TOKEN_EXPIRY;
  const token = await new SignJWT({ userId, email, isAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiryTime)
    .sign(secret);
  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<{ userId: number; email: string; isAdmin?: boolean }> {
  const secret = getJWTSecret();
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: number; email: string; isAdmin?: boolean };
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

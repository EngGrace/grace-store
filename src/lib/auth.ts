import crypto from "crypto";
import { cookies } from "next/headers";

const JWT_SECRET: string = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

const ITERATIONS = 210_000;

/**
 * Hashes a plaintext password using PBKDF2 with a random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored salt:hash string.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  if (!combinedHash || !combinedHash.includes(":")) return false;
  const [salt, originalHash] = combinedHash.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
}

/**
 * Encodes payload into a signed base64 session token.
 */
export function signSessionToken(payload: { id: string; email: string; name: string; role: string }): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // 7 days
  const base64Data = Buffer.from(data).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(base64Data).digest("base64url");
  return `${base64Data}.${signature}`;
}

/**
 * Decodes and verifies a signed session token.
 */
export function verifySessionToken(token: string): { id: string; email: string; name: string; role: string } | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [base64Data, signature] = token.split(".");
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(base64Data).digest("base64url");

    const sigBuf = Buffer.from(signature, "base64url");
    const expBuf = Buffer.from(expectedSignature, "base64url");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = JSON.parse(Buffer.from(base64Data, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Helper to get the logged-in user from the current request cookies.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("grace_store_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

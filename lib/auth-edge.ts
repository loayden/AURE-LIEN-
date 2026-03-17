/**
 * Edge-safe JWT verify for middleware (uses Web Crypto via jose).
 * Signing stays in lib/auth.ts with jsonwebtoken (Node only).
 */
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "luxury-secret-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Edge-safe JWT verify for middleware (uses Web Crypto via jose).
 * Signing stays in lib/auth.ts with jsonwebtoken (Node only).
 */
import { jwtVerify } from "jose";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const jwtSecret = process.env.JWT_SECRET?.trim();
    if (!jwtSecret) return null;

    const secret = new TextEncoder().encode(jwtSecret);
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

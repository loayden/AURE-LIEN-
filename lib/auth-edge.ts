/**
 * Edge-safe JWT verify for middleware (uses Web Crypto via jose).
 * Signing stays in lib/auth.ts with jsonwebtoken (Node only).
 */
import { jwtVerify } from "jose";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return "dev-only-jwt-secret";
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
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

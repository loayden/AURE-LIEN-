import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const TOKEN_COOKIE = "auth_token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return "dev-only-jwt-secret";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  v?: number;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

export function tokenVersionKey(userId: string): string {
  return `aurelien:token-version:${userId}`;
}

/** True if the token was revoked (logout-all / password change). Never throws. */
export async function isTokenRevoked(payload: JWTPayload): Promise<boolean> {
  try {
    if (!payload || typeof payload.v !== "number") return false; // legacy tokens stay valid
    if (payload.userId === "env-admin") return false; // env rotation is the revocation
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (url && token) {
      const res = await fetch(`${url}/get/${encodeURIComponent(tokenVersionKey(payload.userId))}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const json = (await res.json().catch(() => ({}))) as { result?: unknown };
        if (json.result != null && Number(json.result) !== payload.v) return true;
        return false;
      }
    }
    const { findUserById } = await import("@/lib/usersJson");
    const user = await findUserById(payload.userId);
    if (!user) return true;
    return Number(user.tokenVersion ?? 0) !== payload.v;
  } catch {
    return false; // fail open on infra errors; revocation enforced when storage reachable
  }
}

export async function getAuthFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  if (await isTokenRevoked(payload)) return null;
  return payload;
}

export async function getAuthFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  if (await isTokenRevoked(payload)) return null;
  return payload;
}

export { TOKEN_COOKIE };

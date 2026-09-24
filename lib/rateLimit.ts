import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type RateLimitOptions = {
  limit: number;
  windowSec: number;
  prefix: string;
};

type Bucket = { count: number; expiresAt: number };
const memoryBuckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

async function checkUpstashLimit(key: string, limit: number, windowSec: number): Promise<{ allowed: boolean; remaining: number } | null> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token =
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (!url || !token) return null;
    // Fixed window via INCR + EXPIRE. Best-effort: if INCR returns > limit, block.
    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!incrRes.ok) return null;
    const incrJson = (await incrRes.json().catch(() => ({}))) as { result?: number };
    const count = Number(incrJson.result ?? 0);
    if (count === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return null;
  }
}

function checkMemoryLimit(key: string, limit: number, windowSec: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = memoryBuckets.get(key);
  if (!existing || existing.expiresAt <= now) {
    memoryBuckets.set(key, { count: 1, expiresAt: now + windowSec * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }
  existing.count += 1;
  return { allowed: existing.count <= limit, remaining: Math.max(0, limit - existing.count) };
}

export async function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number }> {
  const ip = getClientIp(req);
  const key = `ratelimit:${options.prefix}:${ip}`;
  const upstash = await checkUpstashLimit(key, options.limit, options.windowSec);
  if (upstash) return upstash;
  return checkMemoryLimit(key, options.limit, options.windowSec);
}

export async function rateLimitResponse(
  req: NextRequest,
  options: RateLimitOptions
): Promise<NextResponse | null> {
  const result = await checkRateLimit(req, options);
  if (result.allowed) return null;
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(options.windowSec),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    }
  );
}

export const RATE_LIMITS = {
  auth: { limit: 10, windowSec: 60, prefix: "auth" },
  checkout: { limit: 30, windowSec: 60, prefix: "checkout" },
  saveorder: { limit: 30, windowSec: 60, prefix: "saveorder" },
  cart: { limit: 60, windowSec: 60, prefix: "cart" },
} as const;

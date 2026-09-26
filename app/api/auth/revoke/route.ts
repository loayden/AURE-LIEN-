import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, tokenVersionKey } from "@/lib/auth";
import { findUserById, updateUserSecurity } from "@/lib/usersJson";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * POST: revoke all sessions (logout everywhere). Bumps token version in
 * Mongo + Redis marker so every previously issued token stops working.
 */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  if (auth.userId === "env-admin") {
    return NextResponse.json({ error: "Env admin sessions are revoked by rotating ADMIN_PASSWORD" }, { status: 400, headers: NO_STORE });
  }
  const user = await findUserById(auth.userId);
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404, headers: NO_STORE });
  const nextVersion = Number(user.tokenVersion ?? 0) + 1;
  await updateUserSecurity(user.id, { tokenVersion: nextVersion });
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (url && token) {
      await fetch(`${url}/set/${encodeURIComponent(tokenVersionKey(user.id))}/${nextVersion}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
  } catch {
    // DB version bump is the source of truth; marker is a fast path
  }
  const res = NextResponse.json({ success: true, message: "All sessions revoked. Sign in again." }, { headers: NO_STORE });
  res.cookies.set({ name: "auth_token", value: "", httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

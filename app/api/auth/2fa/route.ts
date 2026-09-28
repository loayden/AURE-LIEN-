import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { findUserById, updateUserSecurity } from "@/lib/usersJson";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** POST: start 2FA setup — returns otpauth URL + QR (auth required). */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  const user = await findUserById(auth.userId);
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404, headers: NO_STORE });
  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "Two-factor is already enabled", enabled: true }, { status: 409, headers: NO_STORE });
  }
  const { generateSecret, generateURI } = await import("otplib");
  const secret = String(user.twoFactorSecret || generateSecret());
  await updateUserSecurity(user.id, { twoFactorSecret: secret, twoFactorEnabled: false });
  const otpauth = generateURI({ issuer: "BOUT", label: user.email, secret });
  let qr = "";
  try {
    const QRCode = (await import("qrcode")).default;
    qr = await QRCode.toDataURL(otpauth);
  } catch {
    qr = "";
  }
  return NextResponse.json({ otpauth_url: otpauth, qr, enabled: false }, { headers: NO_STORE });
}

/** PUT: verify code + enable 2FA. DELETE: disable (password required). */
export async function PUT(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ token: z.string().min(1).max(10) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Code required" }, { status: 400, headers: NO_STORE });
  }
  const user = await findUserById(auth.userId);
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "Start setup first" }, { status: 400, headers: NO_STORE });
  }
  const { verifySync } = await import("otplib");
  const result = verifySync({ secret: String(user.twoFactorSecret), token: parsed.data.token.replace(/\s+/g, "") });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401, headers: NO_STORE });
  }
  await updateUserSecurity(user.id, { twoFactorEnabled: true });
  return NextResponse.json({ success: true, enabled: true }, { headers: NO_STORE });
}

export async function DELETE(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ password: z.string().min(1) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required" }, { status: 400, headers: NO_STORE });
  }
  const { findUserByEmail } = await import("@/lib/usersJson");
  const { verifyPassword } = await import("@/lib/auth");
  const user = await findUserByEmail(auth.email);
  if (!user || !(await verifyPassword(parsed.data.password, user.password))) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401, headers: NO_STORE });
  }
  await updateUserSecurity(user.id, { twoFactorSecret: "", twoFactorEnabled: false });
  return NextResponse.json({ success: true, enabled: false }, { headers: NO_STORE });
}

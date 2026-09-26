import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import User from "@/models/User";
import { findUserByEmail } from "@/lib/usersJson";
import { sendEmailAsync } from "@/lib/email/sender";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";
import { getPublicBaseUrl } from "@/lib/baseUrl";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** POST { email } — always 200 to prevent enumeration. Sends reset link if account exists. */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ email: z.string().email() }).safeParse(body);
  const email = parsed.success ? parsed.data.email.toLowerCase().trim() : "";
  const done = () =>
    NextResponse.json(
      { success: true, message: "If an account exists, a reset link was sent." },
      { headers: NO_STORE }
    );
  if (!email || !hasConfiguredMongoUri()) return done();
  try {
    const user = await findUserByEmail(email);
    if (!user || user.authProvider === "google") return done();
    await connectDB();
    const token = randomBytes(32).toString("hex");
    await User.findOneAndUpdate(
      { id: user.id },
      { resetTokenHash: hashToken(token), resetExpires: new Date(Date.now() + TOKEN_TTL_MS) }
    );
    const base = getPublicBaseUrl(req);
    const link = `${base}/reset-password?token=${token}`;
    sendEmailAsync({
      to: user.email,
      subject: "BOUT password reset",
      html: `<p>Hello ${user.name || "there"},</p><p>Reset your BOUT password with this link (valid 1 hour):</p><p><a href="${link}">Reset password</a></p><p>If you did not request this, ignore this email.</p>`,
    });
  } catch (error) {
    console.warn("Forgot password error:", error instanceof Error ? error.message : String(error));
  }
  return done();
}

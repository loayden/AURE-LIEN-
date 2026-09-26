import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** POST { token, password, confirmPassword } — resets password, revokes sessions. */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = z
    .object({
      token: z.string().min(16).max(128),
      password: z.string().min(8).max(200),
      confirmPassword: z.string().optional(),
    })
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  if (parsed.data.confirmPassword !== undefined && parsed.data.password !== parsed.data.confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400, headers: NO_STORE });
  }
  const { default: zxcvbn } = await import("zxcvbn");
  if (zxcvbn(parsed.data.password, []).score < 2) {
    return NextResponse.json({ error: "Password is too weak. Use a longer phrase." }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Password reset is unavailable" }, { status: 503, headers: NO_STORE });
  }
  try {
    await connectDB();
    const user = await User.findOne({
      resetTokenHash: hashToken(parsed.data.token),
      resetExpires: { $gt: new Date() },
    });
    if (!user) {
      return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400, headers: NO_STORE });
    }
    const hashed = await hashPassword(parsed.data.password);
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { password: hashed, resetTokenHash: "", resetExpires: null },
        $inc: { tokenVersion: 1 },
      }
    );
    return NextResponse.json({ success: true, message: "Password updated. Sign in again." }, { headers: NO_STORE });
  } catch (error) {
    console.error("Reset error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Could not reset password" }, { status: 500, headers: NO_STORE });
  }
}

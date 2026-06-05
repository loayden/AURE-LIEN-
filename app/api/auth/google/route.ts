import { NextRequest, NextResponse } from "next/server";
import { signToken, TOKEN_COOKIE } from "@/lib/auth";
import { attachDeviceCookie, getOrCreateDeviceId } from "@/lib/deviceIdentity";
import { sendEmailAsync } from "@/lib/email/sender";
import { getWelcomeEmailHtml } from "@/lib/email/templates/welcome";
import { verifyGoogleCredential } from "@/lib/googleAuth";
import { findUsersByDeviceId, upsertGoogleUser } from "@/lib/usersJson";

function normalizeAccountIntent(value: unknown): "buyer" | "partner" | "both" {
  const intent = String(value ?? "buyer");
  return ["buyer", "partner", "both"].includes(intent) ? intent as "buyer" | "partner" | "both" : "buyer";
}

function isSameOriginRequest(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  return !origin || origin === req.nextUrl.origin;
}

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Invalid sign-in origin" }, { status: 403 });
    }

    const body = await req.json();
    const profile = await verifyGoogleCredential(body?.credential);
    const accountIntent = normalizeAccountIntent(body?.accountIntent);
    const { deviceId } = getOrCreateDeviceId(req);
    const duplicateDeviceAccounts = await findUsersByDeviceId(deviceId, profile.email);
    const deviceAccountWarning = duplicateDeviceAccounts.length > 0
      ? `Same device has already created ${duplicateDeviceAccounts.length} account(s). Review before approving partner access.`
      : "";

    const { user, created } = await upsertGoogleUser(profile, {
      accountIntent,
      deviceId,
      deviceAccountWarning,
    });

    if (created) {
      sendEmailAsync({
        to: user.email,
        subject: "Welcome to Luxury Bout",
        html: getWelcomeEmailHtml({ userName: user.name }),
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: created ? "Google account created" : "Logged in with Google",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    attachDeviceCookie(response, deviceId);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google sign-in failed";
    const status = message.includes("not configured") ? 503 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

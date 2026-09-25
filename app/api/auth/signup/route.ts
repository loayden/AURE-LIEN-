import { createUser, findUserByEmail, findUsersByDeviceId } from "@/lib/usersJson";
import { hashPassword } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailAsync } from "@/lib/email/sender";
import { getWelcomeEmailHtml } from "@/lib/email/templates/welcome";
import { attachDeviceCookie, getOrCreateDeviceId } from "@/lib/deviceIdentity";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.auth);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { signupSchema, zodErrorMessage } = await import("@/lib/validate");
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const { name, email, password, confirmPassword } = parsed.data;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (password !== confirmPassword && parsed.data.confirmPassword !== undefined) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }
    const { default: zxcvbn } = await import("zxcvbn");
    const strength = zxcvbn(password, [name as string, email as string]);
    if (strength.score < 2) {
      return NextResponse.json(
        { error: "Password is too weak. Use a longer phrase with mixed words.", warning: strength.feedback.warning || undefined },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email as string);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const requestedIntent = String(body.accountIntent ?? "buyer");
    const accountIntent = ["buyer", "partner", "both"].includes(requestedIntent)
      ? requestedIntent as "buyer" | "partner" | "both"
      : "buyer";
    const { deviceId } = getOrCreateDeviceId(req);
    const duplicateDeviceAccounts = await findUsersByDeviceId(
      deviceId,
      String(email).toLowerCase().trim()
    );
    const deviceAccountWarning = duplicateDeviceAccounts.length > 0
      ? `Same device has already created ${duplicateDeviceAccounts.length} account(s). Review before approving partner access.`
      : "";

    const hashed = await hashPassword(password);
    const user = await createUser({
      name: (name as string).trim(),
      email: (email as string).toLowerCase().trim(),
      password: hashed,
      role: "customer",
      accountIntent,
      deviceId,
      deviceAccountWarning,
    });

    sendEmailAsync({
      to: user.email,
      subject: "Welcome to Luxury Bout",
      html: getWelcomeEmailHtml({ userName: user.name }),
    });

    const response = NextResponse.json({
      message: "Account created",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });
    attachDeviceCookie(response, deviceId);

    return response;
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

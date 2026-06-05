import { createUser, findUserByEmail, findUsersByDeviceId } from "@/lib/usersJson";
import { hashPassword } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailAsync } from "@/lib/email/sender";
import { getWelcomeEmailHtml } from "@/lib/email/templates/welcome";
import { attachDeviceCookie, getOrCreateDeviceId } from "@/lib/deviceIdentity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
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

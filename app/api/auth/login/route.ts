import { findUserByEmail, updateUserDeviceInfo } from "@/lib/usersJson";
import { verifyPassword, signToken, TOKEN_COOKIE } from "@/lib/auth";
import { getEnvAdminUser, isEnvAdminLogin } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
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
    const { loginSchema, zodErrorMessage } = await import("@/lib/validate");
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }
    const { email, password } = parsed.data;
    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const envAdmin = getEnvAdminUser();
    if (envAdmin && isEnvAdminLogin(normalizedEmail, String(password))) {
      const token = signToken({
        userId: envAdmin.id,
        email: envAdmin.email,
        role: envAdmin.role,
      });

      const res = NextResponse.json({
        message: "Logged in",
        user: envAdmin,
      }, { status: 200 });

      res.cookies.set({
        name: TOKEN_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      attachDeviceCookie(res, getOrCreateDeviceId(req).deviceId);

      const { logAdminAction, getClientIpFromHeaders } = await import("@/lib/adminAudit");
      await logAdminAction({
        action: "admin.login",
        actorId: envAdmin.id,
        actorEmail: envAdmin.email,
        ip: getClientIpFromHeaders(req.headers),
      });

      return res;
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      message: "Logged in",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 200 });

    res.cookies.set({
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    const { deviceId } = getOrCreateDeviceId(req);
    attachDeviceCookie(res, deviceId);

    await updateUserDeviceInfo(user.id, deviceId).catch((error) => {
      console.warn(
        "User device signal update failed:",
        error instanceof Error ? error.message : String(error)
      );
    });

    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}

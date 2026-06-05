import { findUserByEmail, updateUserDeviceInfo } from "@/lib/usersJson";
import { verifyPassword, signToken, TOKEN_COOKIE } from "@/lib/auth";
import { getEnvAdminUser, isEnvAdminLogin } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { attachDeviceCookie, getOrCreateDeviceId } from "@/lib/deviceIdentity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
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

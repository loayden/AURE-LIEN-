import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";

export const ENV_ADMIN_USER_ID = "env-admin";

export type EnvAdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
  createdAt: string;
};

function getEnvAdminConfig(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export function getEnvAdminUser(): EnvAdminUser | null {
  const config = getEnvAdminConfig();
  if (!config) {
    return null;
  }

  return {
    id: ENV_ADMIN_USER_ID,
    name: "Admin",
    email: config.email,
    role: "admin",
    createdAt: new Date(0).toISOString(),
  };
}

export function isEnvAdminLogin(email: string, password: string): boolean {
  const config = getEnvAdminConfig();
  if (!config) {
    return false;
  }

  return email.trim().toLowerCase() === config.email && password === config.password;
}

export function isEnvAdminIdentity(userId: string, email?: string): boolean {
  const config = getEnvAdminConfig();
  if (!config) {
    return false;
  }

  return (
    userId === ENV_ADMIN_USER_ID ||
    email?.trim().toLowerCase() === config.email
  );
}

export async function requireAdminRequest(req: NextRequest): Promise<NextResponse | null> {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  return null;
}

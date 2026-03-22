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

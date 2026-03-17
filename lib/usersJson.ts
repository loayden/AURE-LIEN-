import { promises as fs } from "fs";
import { paths } from "./dataPaths";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: string;
}

async function readUsers(): Promise<UserRecord[]> {
  try {
    const data = await fs.readFile(paths.users, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users: UserRecord[]) {
  await fs.writeFile(paths.users, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await readUsers();
  const lower = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase() === lower) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const users = await readUsers();
  return users.find((u) => u.id === id) || null;
}

export async function createUser(data: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const users = await readUsers();
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const user: UserRecord = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function updateUserRole(id: string, role: "customer" | "admin"): Promise<void> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users[idx].role = role;
    await writeUsers(users);
  }
}

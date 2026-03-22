import { promises as fs } from "fs";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import { paths } from "./dataPaths";
import {
  getRedisUsers,
  isRedisStorageAvailable,
  setRedisUsers,
} from "@/lib/redisStorage";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

const BLOB_USERS_PATH = "users.json";

function useMongoStorage(): boolean {
  const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
  return Boolean(
    uri &&
      (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

function useCloudStorage(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

function normalizeUser(user: any): UserRecord {
  return {
    id: String(user?.id ?? user?._id ?? `user-${Date.now()}`),
    name: String(user?.name ?? "").trim(),
    email: String(user?.email ?? "").toLowerCase().trim(),
    password: String(user?.password ?? ""),
    role: user?.role === "admin" ? "admin" : "customer",
    createdAt: user?.createdAt
      ? new Date(user.createdAt).toISOString()
      : new Date().toISOString(),
    phone: String(user?.phone ?? "").trim(),
    address: String(user?.address ?? "").trim(),
    apartment: String(user?.apartment ?? "").trim(),
    city: String(user?.city ?? "").trim(),
    postalCode: String(user?.postalCode ?? user?.zipCode ?? "").trim(),
    country: String(user?.country ?? "").trim(),
  };
}

function mergeUsers(primary: UserRecord[], secondary: UserRecord[]): UserRecord[] {
  const byKey = new Map<string, UserRecord>();

  for (const user of secondary.map(normalizeUser)) {
    const key = user.email || user.id;
    if (!key) continue;
    byKey.set(key, user);
  }

  for (const user of primary.map(normalizeUser)) {
    const key = user.email || user.id;
    if (!key) continue;
    byKey.set(key, user);
  }

  return Array.from(byKey.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function readLocalUsers(): Promise<UserRecord[]> {
  try {
    const data = await fs.readFile(paths.users, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : [];
  } catch {
    return [];
  }
}

async function writeLocalUsers(users: UserRecord[]) {
  await fs.writeFile(paths.users, JSON.stringify(users, null, 2));
}

async function readBlobUsers(): Promise<UserRecord[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];
  const { list } = await import("@vercel/blob");
  const result = await list({ prefix: BLOB_USERS_PATH.replace(/\.[^/.]+$/, "") });
  const blob = result.blobs.find((b) => b.pathname === BLOB_USERS_PATH);
  if (!blob) return [];
  const res = await fetch(blob.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : [];
  } catch {
    return [];
  }
}

async function writeBlobUsers(users: UserRecord[]) {
  const { put } = await import("@vercel/blob");
  await put(BLOB_USERS_PATH, JSON.stringify(users, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

async function readMongoUsers(): Promise<UserRecord[]> {
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return users.map(normalizeUser);
}

async function readUserSnapshots(): Promise<UserRecord[]> {
  if (useCloudStorage()) {
    const blobUsers = await readBlobUsers();
    if (blobUsers.length > 0) {
      return blobUsers;
    }
  }

  if (isRedisStorageAvailable()) {
    const redisUsers = await getRedisUsers();
    if (redisUsers && redisUsers.length > 0) {
      return redisUsers.map(normalizeUser);
    }
  }

  return readLocalUsers();
}

async function writeUserSnapshots(users: UserRecord[]) {
  if (useCloudStorage()) {
    await writeBlobUsers(users);
    return;
  }

  if (isRedisStorageAvailable()) {
    await setRedisUsers(users);
    return;
  }

  await writeLocalUsers(users);
}

export async function getUsersJson(): Promise<UserRecord[]> {
  const snapshotUsers = await readUserSnapshots();

  if (!useMongoStorage()) {
    return snapshotUsers;
  }

  try {
    const mongoUsers = await readMongoUsers();
    return mergeUsers(mongoUsers, snapshotUsers);
  } catch {
    return snapshotUsers;
  }
}

async function syncUserSnapshotsFromMongo(): Promise<UserRecord[]> {
  const mongoUsers = await readMongoUsers();
  const merged = mergeUsers(mongoUsers, await readUserSnapshots());
  await writeUserSnapshots(merged);
  return merged;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await getUsersJson();
  const lower = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase() === lower) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const users = await getUsersJson();
  return users.find((u) => u.id === id) || null;
}

export async function createUser(data: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const user = normalizeUser({
    ...data,
    id,
    createdAt: new Date().toISOString(),
  });

  if (useMongoStorage()) {
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { email: user.email },
        user,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      try {
        await syncUserSnapshotsFromMongo();
      } catch (error) {
        console.warn(
          "⚠️ User saved to MongoDB but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
      return user;
    } catch (error) {
      console.warn(
        "⚠️ MongoDB user save failed, falling back to snapshot storage:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const users = await readUserSnapshots();
  await writeUserSnapshots(mergeUsers([user], users));
  return user;
}

export async function updateUserRole(id: string, role: "customer" | "admin"): Promise<void> {
  if (useMongoStorage()) {
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        { role }
      );
      try {
        await syncUserSnapshotsFromMongo();
      } catch (error) {
        console.warn(
          "⚠️ MongoDB user role updated but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
      return;
    } catch (error) {
      console.warn(
        "⚠️ MongoDB user role update failed, falling back to snapshot storage:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const users = await readUserSnapshots();
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users[idx].role = role;
    await writeUserSnapshots(users);
  }
}

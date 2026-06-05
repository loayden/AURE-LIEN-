import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import { paths } from "./dataPaths";
import {
  getRedisUsers,
  isRedisStorageAvailable,
  setRedisUsers,
} from "@/lib/redisStorage";
import {
  hasVercelBlobStorage,
  readBlobTextWithLegacyPublicFallback,
  writeBlobText,
} from "@/lib/blobStorage";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  accountIntent: "buyer" | "partner" | "both";
  authProvider?: "password" | "google" | "mixed";
  googleSub?: string;
  avatar?: string;
  createdAt: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  deviceId?: string;
  deviceAccountWarning?: string;
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
  return hasVercelBlobStorage();
}

function normalizeUser(user: any): UserRecord {
  return {
    id: String(user?.id ?? user?._id ?? `user-${Date.now()}`),
    name: String(user?.name ?? "").trim(),
    email: String(user?.email ?? "").toLowerCase().trim(),
    password: String(user?.password ?? ""),
    role: user?.role === "admin" ? "admin" : "customer",
    accountIntent: ["buyer", "partner", "both"].includes(String(user?.accountIntent))
      ? user.accountIntent
      : "buyer",
    authProvider: ["password", "google", "mixed"].includes(String(user?.authProvider))
      ? user.authProvider
      : user?.googleSub
        ? "google"
        : "password",
    googleSub: String(user?.googleSub ?? "").trim(),
    avatar: String(user?.avatar ?? user?.picture ?? "").trim(),
    createdAt: user?.createdAt
      ? new Date(user.createdAt).toISOString()
      : new Date().toISOString(),
    phone: String(user?.phone ?? "").trim(),
    address: String(user?.address ?? "").trim(),
    apartment: String(user?.apartment ?? "").trim(),
    city: String(user?.city ?? "").trim(),
    postalCode: String(user?.postalCode ?? user?.zipCode ?? "").trim(),
    country: String(user?.country ?? "").trim(),
    deviceId: String(user?.deviceId ?? "").trim(),
    deviceAccountWarning: String(user?.deviceAccountWarning ?? "").trim(),
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
  const text = await readBlobTextWithLegacyPublicFallback(BLOB_USERS_PATH, {
    access: "private",
  });
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : [];
  } catch {
    return [];
  }
}

async function writeBlobUsers(users: UserRecord[]) {
  await writeBlobText(BLOB_USERS_PATH, JSON.stringify(users, null, 2), {
    access: "private",
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

export async function findUsersByDeviceId(
  deviceId: string,
  excludeEmail?: string
): Promise<UserRecord[]> {
  const normalizedDeviceId = String(deviceId ?? "").trim();
  if (!normalizedDeviceId) return [];

  const normalizedEmail = String(excludeEmail ?? "").trim().toLowerCase();
  const users = await getUsersJson();
  return users.filter((user) => {
    if (String(user.deviceId ?? "").trim() !== normalizedDeviceId) return false;
    if (normalizedEmail && user.email.toLowerCase() === normalizedEmail) return false;
    return true;
  });
}

export async function createUser(
  data: Omit<UserRecord, "id" | "createdAt" | "accountIntent"> & Partial<Pick<UserRecord, "accountIntent">>
): Promise<UserRecord> {
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

export async function upsertGoogleUser(
  profile: { sub: string; email: string; name?: string; picture?: string },
  options: {
    accountIntent?: "buyer" | "partner" | "both";
    deviceId?: string;
    deviceAccountWarning?: string;
  } = {}
): Promise<{ user: UserRecord; created: boolean }> {
  const email = String(profile.email ?? "").toLowerCase().trim();
  const googleSub = String(profile.sub ?? "").trim();
  if (!email || !googleSub) {
    throw new Error("Google profile is missing email or subject");
  }

  const existing = await findUserByEmail(email);
  const created = !existing;
  const password = existing?.password || await bcrypt.hash(randomUUID(), 12);
  const requestedIntent = options.accountIntent;
  const accountIntent = ["buyer", "partner", "both"].includes(String(requestedIntent))
    ? requestedIntent
    : undefined;
  const nextUser = normalizeUser({
    ...existing,
    id: existing?.id || `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: existing?.name || String(profile.name ?? "").trim() || email.split("@")[0],
    email,
    password,
    role: existing?.role || "customer",
    accountIntent: existing?.accountIntent || accountIntent || "buyer",
    authProvider: existing
      ? existing.authProvider === "google"
        ? "google"
        : "mixed"
      : "google",
    googleSub,
    avatar: profile.picture,
    createdAt: existing?.createdAt || new Date().toISOString(),
    deviceId: options.deviceId || existing?.deviceId,
    deviceAccountWarning: options.deviceAccountWarning || existing?.deviceAccountWarning,
  });

  if (useMongoStorage()) {
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { email: nextUser.email },
        nextUser,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      try {
        await syncUserSnapshotsFromMongo();
      } catch (error) {
        console.warn(
          "⚠️ Google user saved to MongoDB but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
      return { user: nextUser, created };
    } catch (error) {
      console.warn(
        "⚠️ MongoDB Google user save failed, falling back to snapshot storage:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const users = await readUserSnapshots();
  await writeUserSnapshots(mergeUsers([nextUser], users));
  return { user: nextUser, created };
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

export async function updateUserProfile(
  id: string,
  data: Partial<Pick<UserRecord, "name" | "phone" | "address" | "apartment" | "city" | "postalCode" | "country" | "accountIntent">>
): Promise<UserRecord | null> {
  const updates = {
    name: data.name?.trim(),
    phone: data.phone?.trim(),
    address: data.address?.trim(),
    apartment: data.apartment?.trim(),
    city: data.city?.trim(),
    postalCode: data.postalCode?.trim(),
    country: data.country?.trim(),
    accountIntent: ["buyer", "partner", "both"].includes(String(data.accountIntent))
      ? data.accountIntent
      : undefined,
  };

  Object.keys(updates).forEach((key) => {
    if (updates[key as keyof typeof updates] === undefined) {
      delete updates[key as keyof typeof updates];
    }
  });

  if (updates.name === "") return null;

  if (useMongoStorage()) {
    try {
      await connectDB();
      await User.findOneAndUpdate({ $or: [{ id }, { _id: id }] }, updates);
      try {
        await syncUserSnapshotsFromMongo();
      } catch (error) {
        console.warn(
          "⚠️ MongoDB user profile updated but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
      return findUserById(id);
    } catch (error) {
      console.warn(
        "⚠️ MongoDB user profile update failed, falling back to snapshot storage:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const users = await readUserSnapshots();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  users[idx] = normalizeUser({ ...users[idx], ...updates });
  await writeUserSnapshots(users);
  return users[idx];
}

export async function updateUserDeviceInfo(
  id: string,
  deviceId: string
): Promise<UserRecord | null> {
  const normalizedDeviceId = String(deviceId ?? "").trim();
  if (!id || !normalizedDeviceId) return null;

  const users = await getUsersJson();
  const currentUser = users.find((user) => user.id === id);
  if (!currentUser) return null;

  const duplicateCount = users.filter(
    (user) =>
      user.id !== id &&
      String(user.deviceId ?? "").trim() === normalizedDeviceId
  ).length;
  const deviceAccountWarning = duplicateCount > 0
    ? `Same device has already signed in or created ${duplicateCount} other account(s). Review before approving partner access.`
    : currentUser.deviceAccountWarning;
  const updates: Partial<UserRecord> = {
    deviceId: normalizedDeviceId,
    deviceAccountWarning,
  };

  if (useMongoStorage()) {
    try {
      await connectDB();
      await User.findOneAndUpdate({ $or: [{ id }, { _id: id }] }, updates);
      try {
        await syncUserSnapshotsFromMongo();
      } catch (error) {
        console.warn(
          "⚠️ MongoDB user device updated but snapshot sync failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
      return findUserById(id);
    } catch (error) {
      console.warn(
        "⚠️ MongoDB user device update failed, falling back to snapshot storage:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const snapshotUsers = await readUserSnapshots();
  const idx = snapshotUsers.findIndex((user) => user.id === id);
  if (idx === -1) return null;

  snapshotUsers[idx] = normalizeUser({ ...snapshotUsers[idx], ...updates });
  await writeUserSnapshots(snapshotUsers);
  return snapshotUsers[idx];
}

export async function clearCustomerUserRecords(): Promise<{
  removedUsers: number;
  preservedAdmins: number;
}> {
  const existingUsers = await getUsersJson();
  const adminUsers = existingUsers.filter((user) => user.role === "admin").map(normalizeUser);
  let removedUsers = Math.max(0, existingUsers.length - adminUsers.length);

  if (useMongoStorage()) {
    try {
      await connectDB();
      const result = await User.deleteMany({ role: { $ne: "admin" } });
      removedUsers = Math.max(removedUsers, result.deletedCount ?? 0);
    } catch (error) {
      console.warn(
        "⚠️ MongoDB customer user cleanup failed, falling back to snapshot cleanup:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  await writeUserSnapshots(adminUsers);
  return {
    removedUsers,
    preservedAdmins: adminUsers.length,
  };
}

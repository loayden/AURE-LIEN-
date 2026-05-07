import { Redis } from "@upstash/redis";

const DRAFTS_KEY = "aurelien:drafts";
const LEGACY_DRAFTS_KEY = "drafts";
const CARTS_KEY = "aurelien:carts";
const LEGACY_CARTS_KEY = "carts";
const ORDERS_KEY = "aurelien:orders";
const LEGACY_ORDERS_KEY = "orders";
const PRODUCTS_KEY = "aurelien:products";
const LEGACY_PRODUCTS_KEY = "products";
const USERS_KEY = "aurelien:users";
const LEGACY_USERS_KEY = "users";
const WISHLISTS_KEY = "aurelien:wishlists";
const LEGACY_WISHLISTS_KEY = "wishlists";

let redisClient: Redis | null | undefined;

function hasRedisEnv(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

function getRedis(): Redis | null {
  if (!hasRedisEnv()) {
    return null;
  }

  if (redisClient !== undefined) {
    return redisClient;
  }

  redisClient = Redis.fromEnv();
  return redisClient;
}

function parseStoredJson<T>(value: unknown, fallback: T): T {
  if (value == null) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function isWrongTypeError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("WRONGTYPE");
}

function recordFromArray<T>(values: unknown[]): Record<string, T> {
  const entries = values
    .map((value) => {
      const parsed = parseStoredJson<Record<string, unknown> | null>(value, null);
      if (!parsed) {
        return null;
      }

      const field = String(parsed._id ?? parsed.id ?? "");
      if (!field) {
        return null;
      }

      return [field, parsed as T] as const;
    })
    .filter((entry): entry is readonly [string, T] => entry !== null);

  return Object.fromEntries(entries);
}

function recordFromObject<T>(value: Record<string, unknown>): Record<string, T> {
  const entries = Object.entries(value)
    .map(([field, stored]) => [field, parseStoredJson<T | null>(stored, null)] as const)
    .filter((entry): entry is readonly [string, T] => entry[1] !== null);

  return Object.fromEntries(entries);
}

function normalizeLegacyRecord<T>(value: unknown): Record<string, T> {
  const parsed = parseStoredJson<unknown>(value, null);

  if (!parsed) {
    return {};
  }

  if (Array.isArray(parsed)) {
    return recordFromArray<T>(parsed);
  }

  if (typeof parsed === "object") {
    return recordFromObject<T>(parsed as Record<string, unknown>);
  }

  return {};
}

async function readRedisKeyAsRecord<T>(key: string): Promise<Record<string, T>> {
  const redis = getRedis();
  if (!redis) {
    return {};
  }

  try {
    const values = await redis.hgetall<Record<string, unknown>>(key);
    return recordFromObject<T>(values ?? {});
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }

    const stored = await redis.get<unknown>(key);
    return normalizeLegacyRecord<T>(stored);
  }
}

async function readRedisFieldFromKey<T>(key: string, field: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  try {
    const value = await redis.hget(key, field);
    return parseStoredJson<T | null>(value, null);
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }

    const record = normalizeLegacyRecord<T>(await redis.get<unknown>(key));
    return record[field] ?? null;
  }
}

async function writeRedisHash<T>(key: string, values: Record<string, T>): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis storage is not configured");
  }

  await redis.del(key);

  if (Object.keys(values).length === 0) {
    return;
  }

  const payload: Record<string, string> = {};
  for (const [field, value] of Object.entries(values)) {
    payload[field] = JSON.stringify(value);
  }

  await redis.hset(key, payload);
}

export function isRedisStorageAvailable(): boolean {
  return hasRedisEnv();
}

export async function getDraftsJson(): Promise<Record<string, any>> {
  try {
    const [legacyDrafts, drafts] = await Promise.all([
      readRedisKeyAsRecord<any>(LEGACY_DRAFTS_KEY),
      readRedisKeyAsRecord<any>(DRAFTS_KEY),
    ]);
    return { ...legacyDrafts, ...drafts };
  } catch (error) {
    console.error(
      "❌ Error reading drafts from Redis:",
      error instanceof Error ? error.message : String(error)
    );
    return {};
  }
}

export async function setDraftsJson(drafts: Record<string, any>): Promise<void> {
  try {
    await writeRedisHash(DRAFTS_KEY, drafts);
    console.log("✅ Drafts saved to Redis successfully");
  } catch (error) {
    console.error(
      "❌ Failed to write drafts to Redis:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function getUserDraft(userId: string): Promise<any | null> {
  try {
    const draft =
      (await readRedisFieldFromKey<any>(DRAFTS_KEY, userId)) ??
      (await readRedisFieldFromKey<any>(LEGACY_DRAFTS_KEY, userId));

    return draft;
  } catch (error) {
    console.error(
      `❌ Error fetching draft for user ${userId}:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export async function saveUserDraft(
  userId: string,
  draft: { items: any[]; form: Record<string, unknown> }
): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) {
      throw new Error("Redis storage is not configured");
    }

    const draftWithTimestamp = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    try {
      await redis.hset(DRAFTS_KEY, { [userId]: JSON.stringify(draftWithTimestamp) });
    } catch (error) {
      if (!isWrongTypeError(error)) {
        throw error;
      }
      await redis.del(DRAFTS_KEY);
      await redis.hset(DRAFTS_KEY, { [userId]: JSON.stringify(draftWithTimestamp) });
    }
    console.log(`✅ Draft saved for user ${userId}`);
  } catch (error) {
    console.error(
      `❌ Error saving draft for user ${userId}:`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function deleteUserDraft(userId: string): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    try {
      await redis.hdel(DRAFTS_KEY, userId);
      return;
    } catch (error) {
      if (!isWrongTypeError(error)) {
        throw error;
      }
    }
    await redis.del(DRAFTS_KEY);
  } catch (error) {
    console.error(
      `❌ Error deleting draft for user ${userId}:`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function clearAllDrafts(): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    await redis.del(DRAFTS_KEY);
    console.log("✅ All drafts cleared from Redis");
  } catch (error) {
    console.error(
      "❌ Error clearing all drafts:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

export async function getRedisCart(userId: string): Promise<any[] | null> {
  const cart =
    (await readRedisFieldFromKey<any[]>(CARTS_KEY, userId)) ??
    (await readRedisFieldFromKey<any[]>(LEGACY_CARTS_KEY, userId));

  return Array.isArray(cart) ? cart : [];
}

export async function saveRedisCart(userId: string, items: any[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis storage is not configured");
  }

  try {
    await redis.hset(CARTS_KEY, { [userId]: JSON.stringify(items) });
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }
    await redis.del(CARTS_KEY);
    await redis.hset(CARTS_KEY, { [userId]: JSON.stringify(items) });
  }
}

export async function deleteRedisCart(userId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.hdel(CARTS_KEY, userId);
    return;
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }
  }
  await redis.del(CARTS_KEY);
}

export async function getRedisOrders(): Promise<any[] | null> {
  const [legacyOrders, orders] = await Promise.all([
    readRedisKeyAsRecord<any>(LEGACY_ORDERS_KEY),
    readRedisKeyAsRecord<any>(ORDERS_KEY),
  ]);

  return Object.values({ ...legacyOrders, ...orders });
}

export async function setRedisOrders(orders: any[]): Promise<void> {
  const payload: Record<string, any> = {};
  for (const order of orders) {
    const orderId = String(order?._id ?? order?.id ?? "");
    if (!orderId) continue;
    payload[orderId] = order;
  }

  await writeRedisHash(ORDERS_KEY, payload);
}

export async function appendRedisOrder(order: any): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis storage is not configured");
  }

  const orderId = String(order?._id ?? order?.id ?? "");
  if (!orderId) {
    throw new Error("Order is missing an id");
  }

  try {
    await redis.hset(ORDERS_KEY, { [orderId]: JSON.stringify(order) });
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }
    await redis.del(ORDERS_KEY);
    await redis.hset(ORDERS_KEY, { [orderId]: JSON.stringify(order) });
  }
}

export async function removeRedisOrder(orderId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.hdel(ORDERS_KEY, orderId);
    return;
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }
  }
  await redis.del(ORDERS_KEY);
}

function parseStoredArray(value: unknown): any[] | null {
  if (value == null) {
    return null;
  }

  const parsed = parseStoredJson<unknown>(value, null);
  return Array.isArray(parsed) ? parsed : null;
}

export async function getRedisProducts(): Promise<any[] | null> {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  const products =
    parseStoredArray(await redis.get<unknown>(PRODUCTS_KEY)) ??
    parseStoredArray(await redis.get<unknown>(LEGACY_PRODUCTS_KEY));

  return products;
}

export async function setRedisProducts(products: any[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis storage is not configured");
  }

  await redis.set(PRODUCTS_KEY, JSON.stringify(products));
}

export async function getRedisUsers(): Promise<any[] | null> {
  const [legacyUsers, users] = await Promise.all([
    readRedisKeyAsRecord<any>(LEGACY_USERS_KEY),
    readRedisKeyAsRecord<any>(USERS_KEY),
  ]);

  return Object.values({ ...legacyUsers, ...users });
}

export async function setRedisUsers(users: any[]): Promise<void> {
  const payload: Record<string, any> = {};
  for (const user of users) {
    const userId = String(user?.id ?? user?._id ?? user?.email ?? "");
    if (!userId) continue;
    payload[userId] = user;
  }

  await writeRedisHash(USERS_KEY, payload);
}

export async function getRedisWishlist(userId: string): Promise<any[] | null> {
  const wishlist =
    (await readRedisFieldFromKey<any[]>(WISHLISTS_KEY, userId)) ??
    (await readRedisFieldFromKey<any[]>(LEGACY_WISHLISTS_KEY, userId));

  return Array.isArray(wishlist) ? wishlist : [];
}

export async function saveRedisWishlist(userId: string, items: any[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis storage is not configured");
  }

  try {
    await redis.hset(WISHLISTS_KEY, { [userId]: JSON.stringify(items) });
  } catch (error) {
    if (!isWrongTypeError(error)) {
      throw error;
    }
    await redis.del(WISHLISTS_KEY);
    await redis.hset(WISHLISTS_KEY, { [userId]: JSON.stringify(items) });
  }
}

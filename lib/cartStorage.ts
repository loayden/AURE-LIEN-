import fs from "fs";
import { paths } from "@/lib/dataPaths";
import {
  deleteRedisCart,
  getRedisCart,
  isRedisStorageAvailable,
  saveRedisCart,
} from "@/lib/redisStorage";

export type CartItemRecord = {
  _id?: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

const dataFilePath = paths.cart;

function normalizeCartItem(item: any, userId: string): CartItemRecord {
  return {
    _id:
      typeof item?._id === "string" && item._id.trim()
        ? item._id
        : String(item?.productId ?? ""),
    userId,
    productId: String(item?.productId ?? item?._id ?? ""),
    quantity: Math.max(1, Number(item?.quantity ?? 1)),
    size: item?.size ?? null,
    color: item?.color ?? null,
  };
}

function readLocalCart(): CartItemRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }

    const fileData = fs.readFileSync(dataFilePath, "utf-8");
    const parsed = JSON.parse(fileData);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCart(cart: CartItemRecord[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(cart, null, 2), "utf-8");
  } catch {
    // ignore local file write errors in development fallback
  }
}

export async function getCartByUser(userId: string): Promise<CartItemRecord[]> {
  if (isRedisStorageAvailable()) {
    const redisCart = await getRedisCart(userId);
    return (redisCart ?? [])
      .map((item) => normalizeCartItem(item, userId))
      .filter((item) => item.productId);
  }

  return readLocalCart().filter((item) => item.userId === userId);
}

export async function setCartByUser(
  userId: string,
  items: CartItemRecord[]
): Promise<void> {
  const normalized = items
    .map((item) => normalizeCartItem(item, userId))
    .filter((item) => item.productId);

  if (isRedisStorageAvailable()) {
    await saveRedisCart(userId, normalized);
    return;
  }

  const otherUsers = readLocalCart().filter((item) => item.userId !== userId);
  writeLocalCart([...otherUsers, ...normalized]);
}

export async function clearCartByUser(userId: string): Promise<void> {
  if (isRedisStorageAvailable()) {
    await deleteRedisCart(userId);
    return;
  }

  const nextCart = readLocalCart().filter((item) => item.userId !== userId);
  writeLocalCart(nextCart);
}

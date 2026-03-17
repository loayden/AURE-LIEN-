import { promises as fs } from "fs";
import { paths } from "./dataPaths";

export interface WishlistItem {
  userId: string;
  productId: string;
  createdAt: string;
}

async function readWishlist(): Promise<WishlistItem[]> {
  try {
    const data = await fs.readFile(paths.wishlist, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWishlist(items: WishlistItem[]) {
  await fs.writeFile(paths.wishlist, JSON.stringify(items, null, 2));
}

export async function getWishlistByUser(userId: string): Promise<string[]> {
  const items = await readWishlist();
  return items
    .filter((i) => i.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((i) => i.productId);
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const items = await readWishlist();
  const exists = items.some((i) => i.userId === userId && i.productId === productId);
  if (!exists) {
    items.push({ userId, productId, createdAt: new Date().toISOString() });
    await writeWishlist(items);
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const items = await readWishlist();
  const filtered = items.filter((i) => !(i.userId === userId && i.productId === productId));
  await writeWishlist(filtered);
}

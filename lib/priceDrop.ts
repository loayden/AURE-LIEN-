import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Wishlist from "@/models/Wishlist";
import { getRedisUsers, getRedisWishlist, isRedisStorageAvailable } from "@/lib/redisStorage";

/** User IDs whose wishlist contains the product. Best-effort, capped. */
export async function findWishlisters(productId: string): Promise<string[]> {
  const id = String(productId ?? "").trim();
  if (!id) return [];
  if (hasConfiguredMongoUri()) {
    try {
      await connectDB();
      const rows = await Wishlist.find({ productId: id }).select("userId").limit(500).lean() as Array<{ userId?: string }>;
      const ids = [...new Set(rows.map((r) => String(r.userId ?? "").trim()).filter(Boolean))];
      if (ids.length > 0) return ids;
    } catch {
      // fall through to Redis
    }
  }
  if (!isRedisStorageAvailable()) return [];
  try {
    const users = (await getRedisUsers()) ?? [];
    const found: string[] = [];
    for (const user of users.slice(0, 200) as Array<{ id?: string; _id?: string }>) {
      const uid = String(user.id ?? user._id ?? "").trim();
      if (!uid) continue;
      const items = (await getRedisWishlist(uid).catch(() => null)) ?? [];
      if (items.some((item) => String(item?.productId ?? item?._id ?? "") === id)) {
        found.push(uid);
      }
      if (found.length >= 200) break;
    }
    return found;
  } catch {
    return [];
  }
}

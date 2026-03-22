/**
 * MongoDB wishlist with product data embedded
 */
import connectDB from "./connectDB";
import Wishlist from "@/models/Wishlist";
import {
  getRedisWishlist,
  isRedisStorageAvailable,
  saveRedisWishlist,
} from "@/lib/redisStorage";

export interface ProductDataSnapshot {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
}

function useMongoStorage(): boolean {
  const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
  return Boolean(
    uri &&
      (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

function normalizeWishlistItem(item: any): {
  productId: string;
  productData?: ProductDataSnapshot | null;
} {
  return {
    productId: String(item?.productId ?? item?._id ?? ""),
    productData: item?.productData ?? null,
  };
}

async function getWishlistByUserRedis(userId: string) {
  if (!isRedisStorageAvailable()) {
    return [];
  }

  const items = await getRedisWishlist(userId);
  return Array.isArray(items) ? items.map(normalizeWishlistItem) : [];
}

async function saveWishlistByUserRedis(
  userId: string,
  items: Array<{ productId: string; productData?: ProductDataSnapshot | null }>
) {
  if (!isRedisStorageAvailable()) {
    throw new Error("Wishlist storage is not configured");
  }

  await saveRedisWishlist(
    userId,
    items.map((item) => normalizeWishlistItem(item))
  );
}

export async function getWishlistByUserMongo(userId: string): Promise<Array<{ productId: string; productData?: ProductDataSnapshot | null }>> {
  if (useMongoStorage()) {
    try {
      await connectDB();
      const items = await Wishlist.find({ userId }).sort({ createdAt: -1 }).lean();
      return items.map((i: any) => ({
        productId: i.productId,
        productData: i.productData || null,
      }));
    } catch (error) {
      console.warn(
        "⚠️ MongoDB wishlist read failed, falling back to Redis:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return getWishlistByUserRedis(userId);
}

export async function addToWishlistMongo(
  userId: string,
  productId: string,
  productData?: ProductDataSnapshot | null
): Promise<void> {
  if (useMongoStorage()) {
    try {
      await connectDB();
      await Wishlist.findOneAndUpdate(
        { userId, productId },
        {
          $set: {
            userId,
            productId,
            ...(productData && { productData }),
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      return;
    } catch (error) {
      console.warn(
        "⚠️ MongoDB wishlist write failed, falling back to Redis:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const items = await getWishlistByUserRedis(userId);
  const nextItems = items.filter((item) => item.productId !== productId);
  nextItems.unshift({ productId, productData: productData ?? null });
  await saveWishlistByUserRedis(userId, nextItems);
}

export async function removeFromWishlistMongo(userId: string, productId: string): Promise<void> {
  if (useMongoStorage()) {
    try {
      await connectDB();
      await Wishlist.deleteOne({ userId, productId });
      return;
    } catch (error) {
      console.warn(
        "⚠️ MongoDB wishlist delete failed, falling back to Redis:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  const items = await getWishlistByUserRedis(userId);
  await saveWishlistByUserRedis(
    userId,
    items.filter((item) => item.productId !== productId)
  );
}

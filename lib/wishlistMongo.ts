/**
 * MongoDB wishlist with product data embedded
 */
import connectDB from "./connectDB";
import Wishlist from "@/models/Wishlist";

export interface ProductDataSnapshot {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
}

export async function getWishlistByUserMongo(userId: string): Promise<Array<{ productId: string; productData?: ProductDataSnapshot | null }>> {
  await connectDB();
  const items = await Wishlist.find({ userId }).sort({ createdAt: -1 }).lean();
  return items.map((i: any) => ({
    productId: i.productId,
    productData: i.productData || null,
  }));
}

export async function addToWishlistMongo(
  userId: string,
  productId: string,
  productData?: ProductDataSnapshot | null
): Promise<void> {
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
}

export async function removeFromWishlistMongo(userId: string, productId: string): Promise<void> {
  await connectDB();
  await Wishlist.deleteOne({ userId, productId });
}

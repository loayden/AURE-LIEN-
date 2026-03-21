import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getWishlistByUserMongo } from "@/lib/wishlistMongo";
import productsData from "@/lib/productsData";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const auth = await getAuthFromRequest(req);

    // Not logged in - return empty wishlist with 200
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { items: [], message: "Not authenticated" },
        { status: 200 }
      );
    }

    try {
      const entries = await getWishlistByUserMongo(auth.userId);
      
      const items = entries.map((e) => {
        if (e.productData && e.productData._id) {
          const { _id, ...rest } = e.productData;
          return { _id, ...rest };
        }
        const p = productsData.find((x) => String(x._id) === String(e.productId));
        return p || { _id: e.productId };
      });

      return NextResponse.json({ items }, { status: 200 });
    } catch (mongoError) {
      console.error("❌ Wishlist MongoDB error for user", auth.userId, ":", mongoError instanceof Error ? mongoError.message : String(mongoError));
      
      // Return empty list instead of 500
      return NextResponse.json(
        { items: [], error: "Failed to fetch wishlist" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("❌ Wishlist list error:", error instanceof Error ? error.message : String(error));
    // Return empty list on error instead of 500 for better UX
    return NextResponse.json(
      { items: [], error: "Failed to fetch wishlist" },
      { status: 200 }
    );
  }
}
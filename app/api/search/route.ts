import { NextRequest, NextResponse } from "next/server";
import { ALL_CATEGORY_META, filterProducts } from "@/lib/commerce";
import { getAllProducts } from "@/lib/getAllProducts";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").slice(0, 100);
  const category = (req.nextUrl.searchParams.get("category") || "").slice(0, 80);
  const minPrice = req.nextUrl.searchParams.get("minPrice");
  const maxPrice = req.nextUrl.searchParams.get("maxPrice");
  const color = (req.nextUrl.searchParams.get("color") || "").slice(0, 40);
  const normalizedMinPrice =
    minPrice != null && minPrice !== "" && !Number.isNaN(Number(minPrice))
      ? Number(minPrice)
      : null;
  const normalizedMaxPrice =
    maxPrice != null && maxPrice !== "" && !Number.isNaN(Number(maxPrice))
      ? Number(maxPrice)
      : null;
  const products = await getAllProducts();
  const results = filterProducts(products, {
    query: q,
    category,
    minPrice: normalizedMinPrice,
    maxPrice: normalizedMaxPrice,
    color,
  });

  return NextResponse.json({
    products: results,
    categories: ALL_CATEGORY_META.map((item) => item.slug),
  });
}

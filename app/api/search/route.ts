import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/getAllProducts";
import { filterCatalogProducts, SEARCH_CATEGORIES } from "@/lib/searchProducts";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const category = req.nextUrl.searchParams.get("category") || "";
  const minPrice = req.nextUrl.searchParams.get("minPrice");
  const maxPrice = req.nextUrl.searchParams.get("maxPrice");
  const color = req.nextUrl.searchParams.get("color") || "";
  const limit = req.nextUrl.searchParams.get("limit");
  const normalizedMinPrice =
    minPrice != null && minPrice !== "" && !Number.isNaN(Number(minPrice))
      ? Number(minPrice)
      : null;
  const normalizedMaxPrice =
    maxPrice != null && maxPrice !== "" && !Number.isNaN(Number(maxPrice))
      ? Number(maxPrice)
      : null;
  const normalizedLimit =
    limit != null && limit !== "" && !Number.isNaN(Number(limit))
      ? Number(limit)
      : undefined;
  const products = await getAllProducts();
  const results = filterCatalogProducts(products, q, {
    category,
    minPrice: normalizedMinPrice,
    maxPrice: normalizedMaxPrice,
    color,
    limit: normalizedLimit,
  });

  return NextResponse.json({
    products: results,
    categories: SEARCH_CATEGORIES,
  });
}

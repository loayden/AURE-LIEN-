export const runtime = 'nodejs';
import { getAllProducts } from "@/lib/getAllProducts";
import { categoryMatches } from "@/lib/commerce";
import { convertPrice } from "@/lib/currency";
import { paginateArray, parsePaginationParams } from "@/lib/pagination";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const categoryMap: Record<string, string> = {
  "jackets-coats": "Jackets & Coats",
  "bags-wallets": "Bags & Wallets",
  "lace-ups": "Lace Ups",
  "suits": "Suits",
  "shirts": "Shirts",
  "denim": "Denim",
  "jeans": "Jeans",
  "korean": "Korean",
  "sneakers": "Sneakers",
  "boots": "Boots",
  "loafers": "Loafers",
  "sunglasses": "Sunglasses",
  "belts": "Belts",
  "knitwear": "Knitwear",
};

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFlexibleCategoryRegex(input: string): RegExp {
  // Match common variants:
  // - slug: "jackets-coats"
  // - display: "Jackets & Coats"
  // - spaces/hyphens/& differences: "Jackets Coats", "Jackets-Coats"
  const tokens = input
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .split(/[\s-_]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) return /^$/;

  const pattern = `^${tokens.map(escapeRegex).join("[\\s&-]*")}$`;
  return new RegExp(pattern, "i");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const currency = (url.searchParams.get("currency") ?? "EGP").toUpperCase();
    const hasPagination = url.searchParams.has("page") || url.searchParams.has("limit");
    const allProducts = await getAllProducts();

    let productsList = allProducts;
    if (category) {
      const decoded = decodeURIComponent(category).trim();
      const normalizedKey = decoded.toLowerCase();
      const mappedCategory = categoryMap[normalizedKey] || decoded;

      const regexes = [
        buildFlexibleCategoryRegex(decoded),
        buildFlexibleCategoryRegex(mappedCategory),
      ];

      productsList = allProducts.filter(
        (product) =>
          categoryMatches(product, normalizedKey) ||
          regexes.some((regex) => regex.test(String(product.category ?? "")))
      );
    }

    const withCurrency = productsList.map((p) => ({
      ...p,
      currency,
      displayPrice: convertPrice(Number(p.price ?? 0), currency),
    }));

    if (!hasPagination) {
      return NextResponse.json(withCurrency, {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const { page, limit } = parsePaginationParams(url);
    const { data, pagination } = paginateArray(withCurrency, page, limit);
    return NextResponse.json(
      { products: data, pagination },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

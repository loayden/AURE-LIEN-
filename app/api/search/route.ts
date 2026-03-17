import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/productsData";

const CATEGORIES = [
  "jackets-coats",
  "suits",
  "shirts",
  "knitwear",
  "footwear",
  "sneakers",
  "boots",
  "loafers",
  "lace-ups",
  "accessories",
  "sunglasses",
  "bags-wallets",
  "belts",
];

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase().trim();
  const category = req.nextUrl.searchParams.get("category") || "";
  const minPrice = req.nextUrl.searchParams.get("minPrice");
  const maxPrice = req.nextUrl.searchParams.get("maxPrice");
  const color = req.nextUrl.searchParams.get("color") || "";

  let results = [...productsData];

  if (q) {
    const terms = q.split(/\s+/);
    results = results.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return terms.every(
        (t) => name.includes(t) || desc.includes(t) || cat.includes(t)
      );
    });
  }

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (minPrice != null && minPrice !== "") {
    const n = Number(minPrice);
    if (!Number.isNaN(n)) results = results.filter((p) => p.price >= n);
  }
  if (maxPrice != null && maxPrice !== "") {
    const n = Number(maxPrice);
    if (!Number.isNaN(n)) results = results.filter((p) => p.price <= n);
  }

  if (color) {
    results = results.filter(
      (p) => p.colors?.some((c) => c.toLowerCase().includes(color.toLowerCase()))
    );
  }

  return NextResponse.json({
    products: results,
    categories: CATEGORIES,
  });
}

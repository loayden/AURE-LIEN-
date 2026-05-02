import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/productsData";

type OutfitProduct = (typeof productsData)[number];

const SHOES_BY_STYLE: Record<string, string[]> = {
  formal: ["lace-ups", "loafers", "boots"],
  classic: ["loafers", "lace-ups", "boots"],
  minimal: ["loafers", "sneakers", "lace-ups"],
  modern: ["sneakers", "loafers", "boots"],
  street: ["sneakers", "boots", "loafers"],
};

function pickByCategory(category: string, count: number, excludeIds: Set<string>) {
  const pool = productsData.filter(
    (p) => p.category === category && !excludeIds.has(p._id)
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function pickFromCategories(categories: string[], excludeIds: Set<string>): OutfitProduct | null {
  for (const category of categories) {
    const product = pickByCategory(category, 1, excludeIds)[0];
    if (product) return product;
  }
  return null;
}

function formatLabel(value: unknown, fallback: string) {
  const text = String(value ?? "").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { occasion, style, season } = body;
    const styleKey = String(style ?? "minimal").toLowerCase();
    const shoeCategories = SHOES_BY_STYLE[styleKey] ?? SHOES_BY_STYLE.minimal;
    const occasionLabel = formatLabel(occasion, "Curated");
    const styleLabel = formatLabel(style, "Minimal");
    const seasonLabel = String(season ?? "all").toLowerCase() === "all" ? "All Season" : formatLabel(season, "Seasonal");

    const outfits: { name: string; items: OutfitProduct[] }[] = [];
    const used = new Set<string>();

    for (let i = 0; i < 3; i++) {
      const jacket = pickByCategory("jackets-coats", 1, used)[0] || pickByCategory("suits", 1, used)[0];
      if (jacket) used.add(jacket._id);
      const shirt = pickByCategory("shirts", 1, used)[0];
      if (shirt) used.add(shirt._id);
      const pants = pickByCategory("suits", 1, used)[0] || pickByCategory("jackets-coats", 1, used)[0];
      if (pants) used.add(pants._id);
      const shoes = pickFromCategories(shoeCategories, used);
      if (shoes) used.add(shoes._id);
      const acc = pickByCategory("belts", 1, used)[0] || pickByCategory("sunglasses", 1, used)[0];
      if (acc) used.add(acc._id);

      const items = [jacket, shirt, pants, shoes, acc].filter(
        (item): item is OutfitProduct => Boolean(item)
      );
      if (items.length >= 3) {
        outfits.push({
          name: `${occasionLabel} ${styleLabel} ${seasonLabel} ${i + 1}`,
          items,
        });
      }
    }

    return NextResponse.json({ outfits });
  } catch (e) {
    console.error("Outfit generate error:", e);
    return NextResponse.json({ error: "Failed to generate outfits" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/productsData";

type CatalogProduct = (typeof productsData)[number];

function pickByCategory(category: string, count: number, excludeIds: Set<string>) {
  const pool = productsData.filter(
    (p) => p.category === category && !excludeIds.has(p._id)
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { occasion, style, season } = body;
    const styleValue = String(style || "minimal").toLowerCase();
    const occasionValue = String(occasion || "curated").toLowerCase();
    const seasonValue = String(season || "all").toLowerCase();
    const shoePriority =
      styleValue === "street"
        ? ["sneakers", "boots", "loafers"]
        : occasionValue === "formal" || occasionValue === "business"
          ? ["lace-ups", "loafers", "boots"]
          : ["loafers", "sneakers", "boots"];
    const layerPriority =
      seasonValue === "winter" || seasonValue === "fall"
        ? ["jackets-coats", "knitwear", "suits"]
        : ["suits", "shirts", "jackets-coats"];

    const outfits: { name: string; items: CatalogProduct[] }[] = [];
    const used = new Set<string>();

    for (let i = 0; i < 3; i++) {
      const jacket =
        layerPriority.map((category) => pickByCategory(category, 1, used)[0]).find(Boolean) ||
        pickByCategory("jackets-coats", 1, used)[0];
      if (jacket) used.add(jacket._id);
      const shirt = pickByCategory("shirts", 1, used)[0];
      if (shirt) used.add(shirt._id);
      const pants = pickByCategory("suits", 1, used)[0] || pickByCategory("jackets-coats", 1, used)[0];
      if (pants) used.add(pants._id);
      const shoes = shoePriority.map((category) => pickByCategory(category, 1, used)[0]).find(Boolean);
      if (shoes) used.add(shoes._id);
      const acc = pickByCategory("belts", 1, used)[0] || pickByCategory("sunglasses", 1, used)[0];
      if (acc) used.add(acc._id);

      const items = [jacket, shirt, pants, shoes, acc].filter(
        (item): item is CatalogProduct => Boolean(item)
      );
      if (items.length >= 3) {
        outfits.push({
          name: `Outfit ${i + 1} — ${occasion || "Curated"}`,
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

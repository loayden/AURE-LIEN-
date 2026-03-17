import { NextRequest, NextResponse } from "next/server";
import productsData from "@/lib/productsData";

const CATEGORIES = ["jackets-coats", "shirts", "suits", "knitwear", "lace-ups", "loafers", "boots", "sneakers", "belts", "sunglasses", "bags-wallets"];

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

    const outfits: { name: string; items: typeof productsData }[] = [];
    const used = new Set<string>();

    for (let i = 0; i < 3; i++) {
      const jacket = pickByCategory("jackets-coats", 1, used)[0] || pickByCategory("suits", 1, used)[0];
      if (jacket) used.add(jacket._id);
      const shirt = pickByCategory("shirts", 1, used)[0];
      if (shirt) used.add(shirt._id);
      const pants = pickByCategory("suits", 1, used)[0] || pickByCategory("jackets-coats", 1, used)[0];
      if (pants) used.add(pants._id);
      const shoes = pickByCategory("lace-ups", 1, used)[0] || pickByCategory("loafers", 1, used)[0] || pickByCategory("sneakers", 1, used)[0];
      if (shoes) used.add(shoes._id);
      const acc = pickByCategory("belts", 1, used)[0] || pickByCategory("sunglasses", 1, used)[0];
      if (acc) used.add(acc._id);

      const items = [jacket, shirt, pants, shoes, acc].filter(Boolean);
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

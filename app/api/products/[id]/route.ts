import { getProductById } from "@/lib/getAllProducts";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  let boutique = null;
  const boutiqueId = String((product as unknown as Record<string, unknown>).boutiqueId ?? "").trim();
  if (boutiqueId) {
    try {
      const applications = await getBoutiqueApplications();
      const match = applications.find(
        (a) => a._id === boutiqueId && a.status === "approved" && a.verification?.status === "verified"
      );
      if (match) {
        boutique = { id: match._id, slug: match.storefrontSlug || match._id, name: match.boutiqueName };
      }
    } catch {
      // boutique info is best-effort
    }
  }

  return NextResponse.json({ ...product, boutique }, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

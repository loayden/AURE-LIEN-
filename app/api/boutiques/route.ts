import { NextResponse } from "next/server";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** Public boutique directory — approved boutiques only, no contact details. */
export async function GET() {
  try {
    const [applications, products] = await Promise.all([
      getBoutiqueApplications().catch(() => []),
      getPartnerProducts().catch(() => []),
    ]);
    const liveCount = new Map<string, number>();
    for (const p of products) {
      if (p.status !== "approved") continue;
      liveCount.set(p.applicationId, (liveCount.get(p.applicationId) ?? 0) + 1);
    }
    const boutiques = applications
      .filter((a) => a.status === "approved")
      .map((a) => ({
        id: a._id,
        boutiqueName: a.boutiqueName,
        city: a.city,
        area: a.area,
        categories: a.categories,
        instagram: a.instagram,
        liveProducts: liveCount.get(a._id) ?? 0,
      }));
    return NextResponse.json({ boutiques }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ boutiques: [] }, { headers: NO_STORE });
  }
}

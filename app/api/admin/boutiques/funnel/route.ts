import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** GET: application funnel (draft → pending → approved/declined) + product pipeline. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const [applications, products] = await Promise.all([
    getBoutiqueApplications().catch(() => []),
    getPartnerProducts().catch(() => []),
  ]);
  const byStatus: Record<string, number> = {};
  for (const a of applications) byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
  const byProductStatus: Record<string, number> = {};
  for (const p of products) byProductStatus[p.status] = (byProductStatus[p.status] ?? 0) + 1;
  const submitted = (byStatus.pending ?? 0) + (byStatus.contacted ?? 0) + (byStatus.approved ?? 0) + (byStatus.declined ?? 0);
  return NextResponse.json(
    {
      applications: { total: applications.length, byStatus },
      approvalRate: submitted > 0 ? Math.round(((byStatus.approved ?? 0) / submitted) * 100) : 0,
      products: { total: products.length, byStatus: byProductStatus },
    },
    { headers: NO_STORE }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";
import { getOrdersJson } from "@/lib/orderStorage";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import AnalyticsEvent from "@/models/AnalyticsEvent";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function owns(application: { partnerUserId?: string; email?: string }, auth: NonNullable<Awaited<ReturnType<typeof getAuthFromRequest>>>): boolean {
  if (auth.role === "admin") return true;
  if (application.partnerUserId && application.partnerUserId === auth.userId) return true;
  return Boolean(!application.partnerUserId && application.email && application.email.toLowerCase() === auth.email?.toLowerCase());
}

/** GET: per-product sales + 30d views for a boutique. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  const applicationId = String(new URL(req.url).searchParams.get("applicationId") ?? "").trim();
  if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400, headers: NO_STORE });
  const [applications, products, orders] = await Promise.all([
    getBoutiqueApplications(),
    getPartnerProducts(),
    getOrdersJson(),
  ]);
  const application = applications.find((a) => a._id === applicationId);
  if (!application || !owns(application, auth)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const live = products.filter((p) => p.applicationId === applicationId);
  const liveIds = new Set(live.flatMap((p) => [String(p.productId), String(p._id)]));
  const byProduct = new Map<string, { productId: string; name: string; units: number; revenue: number; views: number }>();
  for (const p of live) {
    byProduct.set(String(p.productId), { productId: String(p.productId), name: p.name, units: 0, revenue: 0, views: 0 });
  }
  for (const order of orders) {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items as Array<{ productId?: string; quantity?: number; price?: number }>) {
      const row = byProduct.get(String(item.productId ?? ""));
      if (!row) continue;
      const qty = Number(item.quantity ?? 1);
      row.units += qty;
      row.revenue += Number(item.price ?? 0) * qty;
    }
  }
  if (hasConfiguredMongoUri() && liveIds.size > 0) {
    try {
      await connectDB();
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const views = await AnalyticsEvent.aggregate([
        { $match: { event: "product_view", productId: { $in: [...liveIds] }, createdAt: { $gte: since } } },
        { $group: { _id: "$productId", count: { $sum: 1 } } },
      ]);
      for (const v of views as Array<{ _id: string; count: number }>) {
        const row = byProduct.get(String(v._id));
        if (row) row.views = Number(v.count ?? 0);
      }
    } catch {
      // views are best-effort
    }
  }
  const rows = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue);
  return NextResponse.json(    {
      totals: {
        units: rows.reduce((s, r) => s + r.units, 0),
        revenue: Math.round(rows.reduce((s, r) => s + r.revenue, 0) * 100) / 100,
        views: rows.reduce((s, r) => s + r.views, 0),
      },
      byProduct: rows,
    },
    { headers: NO_STORE }
  );
}

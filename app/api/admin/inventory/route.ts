import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getAllProducts } from "@/lib/getAllProducts";
import { getOrdersJson } from "@/lib/orderStorage";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import AnalyticsEvent from "@/models/AnalyticsEvent";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * GET: inventory health — stock, 30d sales, 30d views, days-of-cover estimate.
 * Slow movers = stock > 0 with zero sales + zero views in 30d.
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const url = new URL(req.url);
  const slowOnly = url.searchParams.get("slow") === "1";
  const [products, orders] = await Promise.all([
    getAllProducts().catch(() => []),
    getOrdersJson().catch(() => []),
  ]);
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const sales = new Map<string, { units: number; revenue: number }>();
  for (const order of orders) {
    if (new Date(order.createdAt ?? 0).getTime() < since) continue;
    for (const item of (Array.isArray(order.items) ? order.items : []) as Array<{ productId?: string; quantity?: number; price?: number }>) {
      const id = String(item.productId ?? "");
      if (!id) continue;
      const row = sales.get(id) ?? { units: 0, revenue: 0 };
      row.units += Number(item.quantity ?? 1);
      row.revenue += Number(item.price ?? 0) * Number(item.quantity ?? 1);
      sales.set(id, row);
    }
  }
  const views = new Map<string, number>();
  if (hasConfiguredMongoUri()) {
    try {
      await connectDB();
      const rows = await AnalyticsEvent.aggregate([
        { $match: { event: "product_view", createdAt: { $gte: new Date(since) } } },
        { $group: { _id: "$productId", count: { $sum: 1 } } },
      ]);
      for (const r of rows as Array<{ _id: string; count: number }>) views.set(String(r._id), Number(r.count));
    } catch {
      // views best-effort
    }
  }
  let rows = products.map((p) => {
    const s = sales.get(String(p._id)) ?? { units: 0, revenue: 0 };
    const v = views.get(String(p._id)) ?? 0;
    const dailySales = s.units / 30;
    return {
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: typeof p.stock === "number" ? p.stock : null,
      units30d: s.units,
      revenue30d: Math.round(s.revenue * 100) / 100,
      views30d: v,
      daysOfCover: dailySales > 0 && typeof p.stock === "number" ? Math.round(p.stock / dailySales) : null,
      slow: (typeof p.stock !== "number" || p.stock > 0) && s.units === 0 && v === 0,
    };
  });
  if (slowOnly) rows = rows.filter((r) => r.slow);
  rows.sort((a, b) => (a.stock ?? 999999) - (b.stock ?? 999999));
  return NextResponse.json(
    { total: rows.length, slowCount: rows.filter((r) => r.slow).length, rows: rows.slice(0, 200) },
    { headers: NO_STORE }
  );
}

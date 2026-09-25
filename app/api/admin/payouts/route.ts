import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminRoles";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import { getPartnerProducts } from "@/lib/partnerProducts";
import { getOrdersJson, setOrdersJson } from "@/lib/orderStorage";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Payout from "@/models/Payout";
import { parsePaginationParams } from "@/lib/pagination";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if ("response" in gate) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ payouts: [], pagination: { page: 1, limit: 24, total: 0, totalPages: 1 } }, { headers: NO_STORE });
  }
  try {
    await connectDB();
    const url = new URL(req.url);
    const status = String(url.searchParams.get("status") ?? "").trim();
    const filter = status ? { status } : {};
    const { page, limit } = parsePaginationParams(url);
    const total = await Payout.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const payouts = await Payout.find(filter).sort({ createdAt: -1 }).skip((safePage - 1) * limit).limit(limit).lean();
    return NextResponse.json({ payouts, pagination: { page: safePage, limit, total, totalPages } }, { headers: NO_STORE });
  } catch (error) {
    console.error("Admin payouts GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500, headers: NO_STORE });
  }
}

const decideSchema = z.object({
  id: z.string().min(1),
  action: z.enum(["approve", "pay", "reject"]),
  adminNote: z.string().max(1000).optional().default(""),
});

/**
 * PATCH: approve → pay → done. `pay` marks the partner's unpaid order lines
 * as partnerPayoutStatus=paid so the wallet reflects reality.
 */
export async function PATCH(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = decideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Payouts storage not configured" }, { status: 503, headers: NO_STORE });
  }
  try {
    await connectDB();
    const payout = await Payout.findOne({ _id: parsed.data.id });
    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404, headers: NO_STORE });
    }
    const nextStatus = parsed.data.action === "approve" ? "approved" : parsed.data.action === "pay" ? "paid" : "rejected";
    if (payout.status === "paid") {
      return NextResponse.json({ error: "Payout already paid" }, { status: 409, headers: NO_STORE });
    }
    payout.status = nextStatus;
    payout.adminNote = parsed.data.adminNote;
    payout.decidedAt = new Date();
    await payout.save();

    let markedOrders = 0;
    if (nextStatus === "paid") {
      const [products, orders] = await Promise.all([getPartnerProducts(), getOrdersJson()]);
      const liveIds = new Set(
        products
          .filter((p) => p.applicationId === payout.applicationId && p.status === "approved")
          .flatMap((p) => [String(p.productId), String(p._id)])
      );
      let changed = false;
      for (const order of orders) {
        const items = Array.isArray(order.items) ? order.items : [];
        const touchesPartner = items.some((item: { productId?: string }) => liveIds.has(String(item.productId ?? "")));
        if (touchesPartner && String(order.partnerPayoutStatus ?? "") !== "paid") {
          order.partnerPayoutStatus = "paid";
          changed = true;
          markedOrders++;
        }
      }
      if (changed) await setOrdersJson(orders);
    }

    await logAdminAction({
      action: `admin.payout.${parsed.data.action}`,
      actorId: auth.userId,
      actorEmail: auth.email,
      targetType: "payout",
      targetId: payout._id,
      detail: { amount: payout.amount, markedOrders },
      ip: getClientIpFromHeaders(req.headers),
    });
    return NextResponse.json({ success: true, payout, markedOrders }, { headers: NO_STORE });
  } catch (error) {
    console.error("Admin payouts PATCH error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update payout" }, { status: 500, headers: NO_STORE });
  }
}

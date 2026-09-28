import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrCreateUserId } from "@/lib/userSession";
import { getOrdersJson } from "@/lib/orderStorage";
import { loyaltyTier } from "@/lib/loyalty";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  const { userId } = auth?.userId
    ? { userId: auth.userId }
    : await getOrCreateUserId(req);
  const { availablePoints } = await import("@/lib/loyaltyLedger");
  const orders = (await getOrdersJson()).filter((o) => o.userId === userId);
  const points = await availablePoints(userId);
  return NextResponse.json(
    { points, tier: loyaltyTier(points), ordersCount: orders.length },
    { status: 200, headers: NO_STORE }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { cancelCheckoutState } from "@/lib/checkoutCancellation";
import { getDraftsJson, setDraftsJson } from "@/lib/redisStorage";
import { getOrdersJson, setOrdersJson } from "@/lib/orderStorage";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

async function readOrderId(req: NextRequest): Promise<string | null> {
  const { searchParams } = new URL(req.url);
  const queryOrderId = searchParams.get("orderId");
  if (queryOrderId) return queryOrderId;

  try {
    const body = await req.json();
    return typeof body?.orderId === "string" && body.orderId.trim()
      ? body.orderId.trim()
      : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, isNew } = await resolveUserId(req);
    const orderId = await readOrderId(req);
    const [drafts, orders] = await Promise.all([getDraftsJson(), getOrdersJson()]);

    const result = cancelCheckoutState({
      userId,
      orderId,
      drafts,
      orders,
    });

    await Promise.all([
      result.draftRemoved ? setDraftsJson(result.drafts) : Promise.resolve(),
      result.orderRemoved ? setOrdersJson(result.orders) : Promise.resolve(),
    ]);

    const res = NextResponse.json({
      success: true,
      draftRemoved: result.draftRemoved,
      orderRemoved: result.orderRemoved,
    });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("Checkout cancellation error:", error);
    return NextResponse.json({ error: "Failed to cancel checkout" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  return POST(req);
}

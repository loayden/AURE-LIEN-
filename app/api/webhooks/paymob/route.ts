import { NextRequest, NextResponse } from "next/server";
import { getPaymobSignatureFromRequest, verifyPaymobHmac } from "@/lib/paymobVerify";
import { trackServerEvent } from "@/lib/monitoring";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PAYMOB_HMAC_SECRET?.trim()) {
      return NextResponse.json({ error: "Paymob webhook not configured" }, { status: 503, headers: NO_STORE });
    }
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const signature = getPaymobSignatureFromRequest(body, req.headers);
    if (!verifyPaymobHmac(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401, headers: NO_STORE });
    }
    await trackServerEvent({
      event: "purchase",
      metadata: { source: "paymob_webhook", intention: String(body.intention_id ?? body.id ?? "") },
    });
    return NextResponse.json({ received: true }, { headers: NO_STORE });
  } catch (error) {
    console.error("Paymob webhook error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Webhook failed" }, { status: 400, headers: NO_STORE });
  }
}

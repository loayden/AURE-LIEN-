import { NextRequest, NextResponse } from "next/server";
import { getPaymobSignatureFromRequest, verifyPaymobHmac } from "@/lib/paymobVerify";
import { markBoutiqueSubscriptionPaid } from "@/lib/boutiqueApplications";
import { sendEmailAsync } from "@/lib/email/sender";
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
    const extras = (body.extras as Record<string, unknown> | undefined) ?? {};
    const applicationId = String(
      extras.applicationId ?? body.applicationId ?? body.application_id ?? ""
    ).trim();
    const intentionId = String(
      body.intention_id ?? body.intentionId ?? body.id ?? ""
    ).trim();
    if (applicationId) {
      const paid = await markBoutiqueSubscriptionPaid(applicationId, intentionId || undefined);
      if (paid) {
        sendEmailAsync({
          to: paid.email,
          subject: `BOUT subscription active · ${paid.boutiqueName}`,
          html: `<p>Dear ${paid.ownerName || "partner"},</p><p>Your <strong>${paid.planName}</strong> subscription for <strong>${paid.boutiqueName}</strong> is now active. You can manage products from your partner desk.</p>`,
        });
      }
    }
    await trackServerEvent({
      event: "purchase",
      metadata: { source: "paymob_webhook", intention: intentionId, applicationId },
    });
    return NextResponse.json({ received: true }, { headers: NO_STORE });
  } catch (error) {
    console.error("Paymob webhook error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Webhook failed" }, { status: 400, headers: NO_STORE });
  }
}

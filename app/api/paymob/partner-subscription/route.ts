import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  getBoutiqueApplications,
  getBoutiquePartnerPlan,
  markBoutiqueSubscriptionCheckoutStarted,
} from "@/lib/boutiqueApplications";
import { createPaymobPartnerCheckout, getPaymobSetupStatus } from "@/lib/paymob";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeUrl(value: unknown): string | undefined {
  const text = cleanString(value);
  if (!text) return undefined;
  if (/^https?:\/\//i.test(text)) return text;
  return `https://${text}`;
}

export async function POST(req: NextRequest) {
  try {
    const setup = getPaymobSetupStatus();
    if (!setup.configured) {
      return NextResponse.json(
        {
          error: "Paymob is not configured yet.",
          missing: setup.missing,
        },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Sign in with the partner account before starting Paymob checkout." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const body = await req.json().catch(() => ({}));
    const applicationId = cleanString(body.applicationId);
    const plan = getBoutiquePartnerPlan(body.planId);

    if (!applicationId) {
      return NextResponse.json({ error: "Application id is required" }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const application = (await getBoutiqueApplications()).find((item) => item._id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Boutique application was not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }

    const ownsApplication =
      application.partnerUserId === auth.userId ||
      (!application.partnerUserId && application.email && application.email.toLowerCase() === auth.email?.toLowerCase()) ||
      auth.role === "admin";

    if (!ownsApplication) {
      return NextResponse.json(
        { error: "Not authorized for this boutique application" },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    const noPhysicalShop = Boolean(body.noPhysicalShop ?? application.noPhysicalShop);
    const applicationPatch = {
      boutiqueName: cleanString(body.boutiqueName) || application.boutiqueName,
      ownerName: cleanString(body.ownerName) || application.ownerName,
      phone: cleanString(body.phone) || application.phone,
      email: cleanString(body.email) || application.email,
      city: cleanString(body.city) || application.city,
      area: cleanString(body.area) || application.area,
      streetAddress: noPhysicalShop ? "" : cleanString(body.streetAddress) || application.streetAddress,
      noPhysicalShop,
      googleMapsUrl: normalizeUrl(body.googleMapsUrl) || application.googleMapsUrl,
    };

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const returnUrl = `${origin}/partners/products?applicationId=${encodeURIComponent(application._id)}&payment=returned`;
    const checkout = await createPaymobPartnerCheckout({
      amountEgp: plan.monthlyFee,
      applicationId: application._id,
      planId: plan.id,
      planName: plan.name,
      customer: {
        name: applicationPatch.ownerName,
        email: applicationPatch.email,
        phone: applicationPatch.phone,
        city: applicationPatch.city,
        streetAddress: applicationPatch.streetAddress,
      },
      returnUrl,
    });
    await markBoutiqueSubscriptionCheckoutStarted(application._id, plan.id, applicationPatch);

    return NextResponse.json(
      {
        success: true,
        redirectUrl: checkout.redirectUrl,
        intentionId: checkout.intentionId,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Paymob partner subscription error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create Paymob checkout" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

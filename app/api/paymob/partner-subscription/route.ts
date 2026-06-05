import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { createPaymobPartnerCheckout, getPaymobSetupStatus } from "@/lib/paymob";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
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
    const body = await req.json().catch(() => ({}));
    const applicationId = cleanString(body.applicationId);

    if (!applicationId) {
      return NextResponse.json({ error: "Application id is required" }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const application = (await getBoutiqueApplications()).find((item) => item._id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Boutique application was not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }

    if (application.partnerUserId && auth?.userId !== application.partnerUserId) {
      return NextResponse.json(
        { error: "Not authorized for this boutique application" },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const returnUrl = `${origin}/partners/products?applicationId=${encodeURIComponent(application._id)}&payment=returned`;
    const checkout = await createPaymobPartnerCheckout({
      amountEgp: application.monthlyFee,
      applicationId: application._id,
      planId: application.planId,
      planName: application.planName,
      customer: {
        name: application.ownerName,
        email: application.email,
        phone: application.phone,
        city: application.city,
        streetAddress: application.streetAddress,
      },
      returnUrl,
    });

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

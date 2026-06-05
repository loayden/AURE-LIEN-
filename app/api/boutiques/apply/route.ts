import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  BOUTIQUE_PARTNER_PLANS,
  createBoutiqueApplication,
  normalizePayoutMethod,
  normalizePayoutProfile,
  type BoutiquePayoutProfile,
} from "@/lib/boutiqueApplications";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => cleanString(entry)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

function normalizeUrl(value: unknown): string | undefined {
  const text = cleanString(value);
  if (!text) return undefined;

  if (/^https?:\/\//i.test(text)) return text;
  if (/^@/.test(text)) return text;
  return `https://${text}`;
}

function validatePayoutProfile(profile?: BoutiquePayoutProfile): string | null {
  if (!profile?.method) return "Choose a payout method.";
  if (!profile.accountHolderName) return "Account holder name is required.";
  if (profile.method === "bank_account") {
    if (!profile.bankName) return "Bank name is required.";
    if (!profile.iban) return "IBAN or bank account reference is required.";
  }
  if (profile.method === "mobile_wallet" && !profile.mobileWalletPhone) {
    return "Mobile wallet phone number is required.";
  }
  if (profile.method === "paymob_merchant" && !profile.paymobMerchantId) {
    return "Paymob merchant or sub-merchant ID is required.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    const body = await req.json();
    const requiredFields = [
      ["boutiqueName", "Boutique name is required"],
      ["ownerName", "Owner name is required"],
      ["phone", "Phone number is required"],
      ["city", "City is required"],
      ["area", "Area is required"],
      ["streetAddress", "Street address is required"],
    ] as const;

    for (const [field, message] of requiredFields) {
      if (!cleanString(body?.[field])) {
        return NextResponse.json({ error: message }, { status: 400, headers: NO_STORE_HEADERS });
      }
    }

    const plan =
      BOUTIQUE_PARTNER_PLANS.find((item) => item.id === cleanString(body?.planId)) ??
      BOUTIQUE_PARTNER_PLANS[1];
    const requestedTrialDays = Number(body?.trialDays);
    const trialDays = requestedTrialDays === 7 ? 7 : 14;
    const payoutProfile = normalizePayoutProfile({
      method: normalizePayoutMethod(body?.payoutMethod),
      accountHolderName: body?.payoutAccountName,
      bankName: body?.payoutBankName,
      iban: body?.payoutIban,
      mobileWalletPhone: body?.payoutWalletPhone,
      paymobMerchantId: body?.paymobMerchantId,
      taxId: body?.taxId,
      status: "pending_review",
    });
    const payoutValidationError = validatePayoutProfile(payoutProfile);
    if (payoutValidationError) {
      return NextResponse.json({ error: payoutValidationError }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const application = await createBoutiqueApplication({
      partnerUserId: auth?.userId,
      boutiqueName: cleanString(body.boutiqueName),
      ownerName: cleanString(body.ownerName),
      phone: cleanString(body.phone),
      email: cleanString(body.email),
      city: cleanString(body.city),
      area: cleanString(body.area),
      streetAddress: cleanString(body.streetAddress),
      googleMapsUrl: normalizeUrl(body.googleMapsUrl),
      instagram: normalizeUrl(body.instagram),
      categories: parseStringList(body.categories),
      productCount: Math.max(0, Math.floor(Number(body.productCount ?? 0))),
      averagePrice: Number.isFinite(Number(body.averagePrice))
        ? Math.max(0, Math.floor(Number(body.averagePrice)))
        : undefined,
      planId: plan.id,
      planName: plan.name,
      monthlyFee: plan.monthlyFee,
      commissionRate: plan.commissionRate,
      trialDays,
      payoutProfile,
      sampleProducts: cleanString(body.sampleProducts) || undefined,
      notes: cleanString(body.notes) || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        application: {
          _id: application._id,
          boutiqueName: application.boutiqueName,
          planName: application.planName,
          monthlyFee: application.monthlyFee,
          commissionRate: application.commissionRate,
          trialDays: application.trialDays,
          payoutStatus: application.payoutProfile?.status ?? "missing",
          status: application.status,
        },
      },
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Boutique application error:", error);
    return NextResponse.json(
      { error: "Failed to submit boutique application" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  getBoutiqueApplications,
  getPayoutProfileCompleteness,
  normalizePayoutMethod,
  normalizePayoutProfile,
  updateBoutiquePayoutProfile,
  type BoutiquePayoutProfile,
} from "@/lib/boutiqueApplications";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function validateProfile(profile?: BoutiquePayoutProfile): string | null {
  if (!profile?.method) return "Choose a payout method.";
  if (!profile.accountHolderName) return "Account holder name is required.";
  if (profile.method === "bank_account") {
    if (!profile.bankName) return "Bank name is required.";
    if (!profile.iban) return "IBAN or bank account reference is required.";
    const compact = String(profile.iban).replace(/\s+/g, "").toUpperCase();
    // Egyptian IBAN: EG + 2 check digits + 25 BBAN chars (29 total). Accept
    // raw domestic account numbers too, but flag malformed IBANs.
    if (/^EG/i.test(compact) && !/^EG[0-9]{2}[A-Z0-9]{25}$/.test(compact)) {
      return "That IBAN does not look valid. Egyptian IBANs are 29 characters starting with EG.";
    }
    if (compact.length < 8) return "Bank account reference is too short.";
  }
  if (profile.method === "mobile_wallet") {
    if (!profile.mobileWalletPhone) return "Mobile wallet phone number is required.";
    const digits = String(profile.mobileWalletPhone).replace(/\D+/g, "").replace(/^20/, "");
    if (!/^01[0-9]{9}$/.test(digits)) {
      return "Mobile wallet number must be an 11-digit Egyptian number (01xxxxxxxxx).";
    }
  }
  if (profile.method === "paymob_merchant" && !profile.paymobMerchantId) {
    return "Paymob merchant or sub-merchant ID is required.";
  }
  return null;
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Sign in with the partner account to update payout details." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const body = await req.json().catch(() => ({}));
    const applicationId = cleanString(body.applicationId);
    if (!applicationId) {
      return NextResponse.json({ error: "applicationId is required" }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const applications = await getBoutiqueApplications();
    const application = applications.find((item) => item._id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Boutique application was not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }

    const ownsApplication =
      application.partnerUserId === auth.userId ||
      (!application.partnerUserId && application.email && application.email.toLowerCase() === auth.email?.toLowerCase());

    if (!ownsApplication && auth.role !== "admin") {
      return NextResponse.json({ error: "Not authorized for this boutique application" }, { status: 403, headers: NO_STORE_HEADERS });
    }

    const profile = normalizePayoutProfile({
      method: normalizePayoutMethod(body.method),
      accountHolderName: body.accountHolderName,
      bankName: body.bankName,
      iban: body.iban,
      mobileWalletPhone: body.mobileWalletPhone,
      paymobMerchantId: body.paymobMerchantId,
      taxId: body.taxId,
      status: "pending_review",
    });
    const validationError = validateProfile(profile);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const updated = await updateBoutiquePayoutProfile(applicationId, profile as BoutiquePayoutProfile);
    if (!updated) {
      return NextResponse.json({ error: "Unable to update payout profile" }, { status: 500, headers: NO_STORE_HEADERS });
    }

    return NextResponse.json(
      {
        success: true,
        payoutProfile: updated.payoutProfile,
        status: getPayoutProfileCompleteness(updated.payoutProfile),
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Partner payout profile save error:", error);
    return NextResponse.json(
      { error: "Unable to save payout profile right now." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

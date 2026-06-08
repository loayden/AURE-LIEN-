import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  BOUTIQUE_PARTNER_PLANS,
  findBoutiqueApplicationDraft,
  getBoutiqueApplications,
  getBoutiquePartnerAccess,
  normalizePayoutMethod,
  normalizePayoutProfile,
  upsertBoutiqueApplicationDraft,
  type BoutiqueApplication,
  type BoutiquePlanId,
} from "@/lib/boutiqueApplications";
import { attachUserCookie, getOrCreateUserId } from "@/lib/userSession";

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

function normalizePlanId(value: unknown): BoutiquePlanId {
  const requested = cleanString(value);
  return (BOUTIQUE_PARTNER_PLANS.find((plan) => plan.id === requested)?.id ?? "starter") as BoutiquePlanId;
}

function normalizePhone(value: unknown): string {
  return cleanString(value).replace(/[^\d+]/g, "");
}

function serializeDraft(application: BoutiqueApplication | null) {
  if (!application) return null;
  return {
    _id: application._id,
    boutiqueName: application.boutiqueName,
    ownerName: application.ownerName,
    phone: application.phone,
    email: application.email,
    city: application.city,
    area: application.area,
    streetAddress: application.streetAddress,
    noPhysicalShop: Boolean(application.noPhysicalShop),
    googleMapsUrl: application.googleMapsUrl ?? "",
    instagram: application.instagram ?? "",
    categories: application.categories,
    productCount: application.productCount,
    averagePrice: application.averagePrice,
    planId: application.planId,
    planName: application.planName,
    monthlyFee: application.monthlyFee,
    commissionRate: application.commissionRate,
    trialDays: application.trialDays,
    subscriptionFlow: application.subscriptionFlow,
    subscriptionStatus: application.subscriptionStatus,
    payoutProfile: application.payoutProfile,
    sampleProducts: application.sampleProducts ?? "",
    notes: application.notes ?? "",
    status: application.status,
    updatedAt: application.updatedAt,
  };
}

function serializeExistingApplication(application: BoutiqueApplication | null) {
  if (!application) return null;
  return {
    _id: application._id,
    boutiqueName: application.boutiqueName,
    planId: application.planId,
    planName: application.planName,
    status: application.status,
    subscriptionStatus: application.subscriptionStatus,
    trialDays: application.trialDays,
    createdAt: application.createdAt,
    access: getBoutiquePartnerAccess(application),
  };
}

function findExistingStarterApplication(applications: BoutiqueApplication[], options: {
  partnerUserId?: string;
  draftOwnerId?: string;
  email?: string;
  phone?: string;
}) {
  const email = cleanString(options.email).toLowerCase();
  const phone = normalizePhone(options.phone);

  return applications.find((application) => {
    if (application.status === "draft") return false;
    if (application.planId !== "starter") return false;
    if (options.partnerUserId && application.partnerUserId === options.partnerUserId) return true;
    if (options.draftOwnerId && application.draftOwnerId === options.draftOwnerId) return true;
    if (email && application.email.toLowerCase() === email) return true;
    if (phone && normalizePhone(application.phone) === phone) return true;
    return false;
  }) ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    const { userId: draftOwnerId, isNew } = getOrCreateUserId(req);
    const planId = normalizePlanId(req.nextUrl.searchParams.get("planId"));
    const draft = await findBoutiqueApplicationDraft({
      partnerUserId: auth?.userId,
      draftOwnerId,
      email: auth?.email,
      planId,
    });
    const application = findExistingStarterApplication(await getBoutiqueApplications(), {
      partnerUserId: auth?.userId,
      draftOwnerId,
      email: auth?.email || draft?.email,
      phone: draft?.phone,
    });

    const res = NextResponse.json(
      {
        draft: serializeDraft(draft),
        application: serializeExistingApplication(application),
      },
      { headers: NO_STORE_HEADERS }
    );
    if (isNew) attachUserCookie(res, draftOwnerId);
    return res;
  } catch (error) {
    console.error("Boutique draft load error:", error);
    return NextResponse.json({ error: "Failed to load boutique draft" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

async function saveDraftFromRequest(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    const { userId: draftOwnerId, isNew } = getOrCreateUserId(req);
    const body = await req.json().catch(() => ({}));
    const planId = normalizePlanId(body?.planId);
    const plan = BOUTIQUE_PARTNER_PLANS.find((item) => item.id === planId) ?? BOUTIQUE_PARTNER_PLANS[0];
    const noPhysicalShop = Boolean(body?.noPhysicalShop);
    const subscriptionFlow = body?.subscriptionFlow === "paid" ? "paid" : plan.id === "starter" ? "trial" : "paid";

    const draft = await upsertBoutiqueApplicationDraft({
      _id: cleanString(body?._id) || undefined,
      partnerUserId: auth?.userId,
      draftOwnerId,
      boutiqueName: cleanString(body?.boutiqueName),
      ownerName: cleanString(body?.ownerName),
      phone: cleanString(body?.phone),
      email: cleanString(body?.email || auth?.email),
      city: cleanString(body?.city),
      area: cleanString(body?.area),
      streetAddress: noPhysicalShop ? "" : cleanString(body?.streetAddress),
      noPhysicalShop,
      googleMapsUrl: normalizeUrl(body?.googleMapsUrl),
      instagram: normalizeUrl(body?.instagram),
      categories: parseStringList(body?.categories),
      productCount: Math.max(0, Math.floor(Number(body?.productCount ?? 0))),
      averagePrice: Number.isFinite(Number(body?.averagePrice))
        ? Math.max(0, Math.floor(Number(body.averagePrice)))
        : undefined,
      planId: plan.id,
      planName: plan.name,
      monthlyFee: plan.monthlyFee,
      commissionRate: plan.commissionRate,
      trialDays: plan.trialDays,
      subscriptionFlow,
      subscriptionStatus: subscriptionFlow === "trial" ? "trial_draft" : "checkout_draft",
      payoutProfile: normalizePayoutProfile({
        method: normalizePayoutMethod(body?.payoutMethod),
        accountHolderName: body?.payoutAccountName,
        bankName: body?.payoutBankName,
        iban: body?.payoutIban,
        mobileWalletPhone: body?.payoutWalletPhone,
        paymobMerchantId: body?.paymobMerchantId,
        taxId: body?.taxId,
        status: "pending_review",
      }),
      sampleProducts: cleanString(body?.sampleProducts) || undefined,
      notes: cleanString(body?.notes) || undefined,
    });

    const res = NextResponse.json({ success: true, draft: serializeDraft(draft) }, { headers: NO_STORE_HEADERS });
    if (isNew) attachUserCookie(res, draftOwnerId);
    return res;
  } catch (error) {
    console.error("Boutique draft save error:", error);
    return NextResponse.json({ error: "Failed to save boutique draft" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function PUT(req: NextRequest) {
  return saveDraftFromRequest(req);
}

export async function POST(req: NextRequest) {
  return saveDraftFromRequest(req);
}

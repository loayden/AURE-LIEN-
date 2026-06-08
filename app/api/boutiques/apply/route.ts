import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  BOUTIQUE_PARTNER_PLANS,
  getBoutiqueApplications,
  getBoutiquePartnerAccess,
  submitBoutiqueApplication,
} from "@/lib/boutiqueApplications";
import { notifyPartnerApplicationReceived } from "@/lib/notifications";
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

function normalizePhone(value: unknown): string {
  return cleanString(value).replace(/[^\d+]/g, "");
}

function getStarterTrialMatch(application: Awaited<ReturnType<typeof getBoutiqueApplications>>[number], options: {
  currentId?: string;
  partnerUserId?: string;
  draftOwnerId?: string;
  email?: string;
  phone?: string;
}) {
  if (application.status === "draft") return false;
  if (application.planId !== "starter") return false;
  if (options.currentId && application._id === options.currentId) return false;
  if (options.partnerUserId && application.partnerUserId === options.partnerUserId) return true;
  if (options.draftOwnerId && application.draftOwnerId === options.draftOwnerId) return true;
  if (options.email && application.email.toLowerCase() === options.email.toLowerCase()) return true;
  if (options.phone && normalizePhone(application.phone) === options.phone) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    const { userId: draftOwnerId, isNew } = getOrCreateUserId(req);
    const body = await req.json();
    const noPhysicalShop = Boolean(body?.noPhysicalShop);
    const requiredFields = [
      ["boutiqueName", "Boutique name is required"],
      ["ownerName", "Owner name is required"],
      ["phone", "Phone number is required"],
      ["city", "City is required"],
      ["area", "Area is required"],
    ] as const;

    for (const [field, message] of requiredFields) {
      if (!cleanString(body?.[field])) {
        return NextResponse.json({ error: message }, { status: 400, headers: NO_STORE_HEADERS });
      }
    }
    if (!noPhysicalShop && !cleanString(body?.streetAddress)) {
      return NextResponse.json({ error: "Street address is required" }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const plan = BOUTIQUE_PARTNER_PLANS[0];
    const trialDays = plan.trialDays;
    const currentApplicationId = cleanString(body?.draftId) || cleanString(body?._id) || undefined;
    const email = cleanString(body.email || auth?.email);
    const phone = normalizePhone(body.phone);
    const duplicateStarterTrial = (await getBoutiqueApplications()).find((application) =>
      getStarterTrialMatch(application, {
        currentId: currentApplicationId,
        partnerUserId: auth?.userId,
        draftOwnerId,
        email,
        phone,
      })
    );

    if (duplicateStarterTrial) {
      const access = getBoutiquePartnerAccess(duplicateStarterTrial);
      const productsUrl = `/partners/products?applicationId=${encodeURIComponent(duplicateStarterTrial._id)}`;
      const redirectUrl = access.canManageProducts ? productsUrl : access.subscriptionUrl;
      return NextResponse.json(
        {
          error: access.canManageProducts
            ? "This account, device, email, or phone already has an active Starter trial. Continue from the existing boutique product desk."
            : "This account, device, email, or phone already used the Starter trial. Subscribe to continue.",
          applicationId: duplicateStarterTrial._id,
          redirectUrl,
          subscriptionUrl: access.subscriptionUrl,
        },
        { status: 409, headers: NO_STORE_HEADERS }
      );
    }

    const application = await submitBoutiqueApplication({
      _id: currentApplicationId,
      partnerUserId: auth?.userId,
      draftOwnerId,
      boutiqueName: cleanString(body.boutiqueName),
      ownerName: cleanString(body.ownerName),
      phone: cleanString(body.phone),
      email: cleanString(body.email || auth?.email),
      city: cleanString(body.city),
      area: cleanString(body.area),
      streetAddress: noPhysicalShop ? "" : cleanString(body.streetAddress),
      noPhysicalShop,
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
      subscriptionFlow: "trial",
      subscriptionStatus: "trial_submitted",
      sampleProducts: cleanString(body.sampleProducts) || undefined,
      notes: cleanString(body.notes) || undefined,
    });
    notifyPartnerApplicationReceived(application);

    const res = NextResponse.json(
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
    if (isNew) attachUserCookie(res, draftOwnerId);
    return res;
  } catch (error) {
    console.error("Boutique application error:", error);
    return NextResponse.json(
      { error: "Failed to submit boutique application" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

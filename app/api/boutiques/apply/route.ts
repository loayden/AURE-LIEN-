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

/** PUT: owner edits details while still draft/pending/contacted. Plan & billing untouched. */
export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const applicationId = cleanString(body.applicationId ?? body._id);
    if (!applicationId) {
      return NextResponse.json({ error: "applicationId is required" }, { status: 400, headers: NO_STORE_HEADERS });
    }
    const applications = await getBoutiqueApplications();
    const application = applications.find((item) => item._id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }
    const isOwner =
      auth?.role === "admin" ||
      (auth && application.partnerUserId === auth.userId) ||
      (auth && !application.partnerUserId && application.email.toLowerCase() === auth.email?.toLowerCase());
    if (!isOwner) {
      return NextResponse.json({ error: "Not authorized for this application" }, { status: 403, headers: NO_STORE_HEADERS });
    }
    const { updateBoutiqueApplicationDetails } = await import("@/lib/boutiqueApplications");
    const list = (value: unknown): string[] | undefined => {
      if (value === undefined) return undefined;
      const arr = Array.isArray(value) ? value : String(value).split(",");
      return arr.map((v) => String(v).trim()).filter(Boolean);
    };
    const num = (value: unknown): number | undefined => {
      if (value === undefined || value === "") return undefined;
      const n = Number(value);
      return Number.isFinite(n) ? n : undefined;
    };
    const updated = await updateBoutiqueApplicationDetails(applicationId, {
      boutiqueName: body.boutiqueName !== undefined ? cleanString(body.boutiqueName) : undefined,
      ownerName: body.ownerName !== undefined ? cleanString(body.ownerName) : undefined,
      phone: body.phone !== undefined ? normalizePhone(body.phone) : undefined,
      email: body.email !== undefined ? cleanString(body.email).toLowerCase() : undefined,
      city: body.city !== undefined ? cleanString(body.city) : undefined,
      area: body.area !== undefined ? cleanString(body.area) : undefined,
      streetAddress: body.streetAddress !== undefined ? cleanString(body.streetAddress) : undefined,
      noPhysicalShop: typeof body.noPhysicalShop === "boolean" ? body.noPhysicalShop : undefined,
      googleMapsUrl: body.googleMapsUrl !== undefined ? normalizeUrl(body.googleMapsUrl) : undefined,
      instagram: body.instagram !== undefined ? cleanString(body.instagram) : undefined,
      categories: list(body.categories),
      productCount: num(body.productCount) !== undefined ? Math.max(0, Math.floor(num(body.productCount) as number)) : undefined,
      averagePrice: num(body.averagePrice) !== undefined ? Math.max(0, Math.floor(num(body.averagePrice) as number)) : undefined,
      sampleProducts: body.sampleProducts !== undefined ? cleanString(body.sampleProducts) : undefined,
      notes: body.notes !== undefined ? cleanString(body.notes) : undefined,
    });
    if (!updated) {
      return NextResponse.json({ error: "Application can no longer be edited" }, { status: 409, headers: NO_STORE_HEADERS });
    }
    return NextResponse.json({ success: true, application: updated }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Boutique application edit error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update application" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

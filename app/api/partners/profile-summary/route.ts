import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import {
  getBoutiqueApplications,
  getBoutiquePartnerAccess,
  type BoutiqueApplication,
} from "@/lib/boutiqueApplications";
import { getOrdersJson } from "@/lib/orderStorage";
import { getPartnerProducts } from "@/lib/partnerProducts";
import { buildPartnerWallet } from "@/lib/partnerWallet";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function ownsApplication(application: BoutiqueApplication, auth: NonNullable<Awaited<ReturnType<typeof getAuthFromRequest>>>): boolean {
  if (application.partnerUserId && application.partnerUserId === auth.userId) return true;
  return Boolean(
    !application.partnerUserId &&
      application.email &&
      application.email.toLowerCase() === auth.email?.toLowerCase()
  );
}

function toApplicationSummary(application: BoutiqueApplication) {
  return {
    _id: application._id,
    boutiqueName: application.boutiqueName,
    ownerName: application.ownerName,
    phone: application.phone,
    email: application.email,
    planName: application.planName,
    planId: application.planId,
    monthlyFee: application.monthlyFee,
    commissionRate: application.commissionRate,
    trialDays: application.trialDays,
    subscriptionStatus: application.subscriptionStatus,
    status: application.status,
    city: application.city,
    area: application.area,
    streetAddress: application.streetAddress,
    noPhysicalShop: Boolean(application.noPhysicalShop),
    googleMapsUrl: application.googleMapsUrl ?? "",
    createdAt: application.createdAt,
    payoutStatus: application.payoutProfile?.status ?? "missing",
    access: getBoutiquePartnerAccess(application),
  };
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Sign in to view partner profile summary." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedApplicationId = cleanString(searchParams.get("applicationId"));
    const applications = (await getBoutiqueApplications())
      .filter((application) => ownsApplication(application, auth))
      .filter((application) => application.status !== "draft");

    const selectedApplication =
      applications.find((application) => application._id === requestedApplicationId) ??
      applications[0] ??
      null;

    if (!selectedApplication) {
      return NextResponse.json(
        {
          applications: [],
          selectedApplication: null,
          pendingProductCount: 0,
          wallet: null,
        },
        { headers: NO_STORE_HEADERS }
      );
    }

    const [products, orders] = await Promise.all([getPartnerProducts(), getOrdersJson()]);
    const applicationProducts = products.filter((product) => product.applicationId === selectedApplication._id);
    const pendingProductCount = applicationProducts.filter((product) => product.status === "pending").length;
    const wallet = buildPartnerWallet({
      application: selectedApplication,
      products: applicationProducts,
      orders,
    });

    return NextResponse.json(
      {
        applications: applications.map(toApplicationSummary),
        selectedApplication: toApplicationSummary(selectedApplication),
        pendingProductCount,
        wallet,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Partner profile summary load error:", error);
    return NextResponse.json(
      { error: "Unable to load partner profile summary right now." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

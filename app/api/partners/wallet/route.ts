import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getOrdersJson } from "@/lib/orderStorage";
import { getPartnerProducts } from "@/lib/partnerProducts";
import { buildPartnerWallet } from "@/lib/partnerWallet";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Sign in with the partner account to view wallet and customer order details." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const { searchParams } = new URL(req.url);
    const applicationId = cleanString(searchParams.get("applicationId"));
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
      return NextResponse.json({ error: "Not authorized for this partner wallet" }, { status: 403, headers: NO_STORE_HEADERS });
    }

    const [products, orders] = await Promise.all([getPartnerProducts(), getOrdersJson()]);
    const wallet = buildPartnerWallet({
      application,
      products: products.filter((product) => product.applicationId === applicationId),
      orders,
    });

    return NextResponse.json({ wallet }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Partner wallet load error:", error);
    return NextResponse.json(
      { error: "Unable to load partner wallet right now." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

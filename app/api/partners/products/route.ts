import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { createPartnerProductDraft, getPartnerProducts } from "@/lib/partnerProducts";
import { notifyPartnerProductSubmitted } from "@/lib/notifications";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => cleanString(entry)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  return [];
}

function ownsApplication(application: { partnerUserId?: string; email?: string }, auth: NonNullable<Awaited<ReturnType<typeof getAuthFromRequest>>>): boolean {
  if (auth.role === "admin") return true;
  if (application.partnerUserId && application.partnerUserId === auth.userId) return true;
  return Boolean(
    !application.partnerUserId &&
      application.email &&
      application.email.toLowerCase() === auth.email?.toLowerCase()
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Sign in with the partner account to view submitted products." },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const applicationId = cleanString(searchParams.get("applicationId"));
  const applications = await getBoutiqueApplications();
  const application = applications.find((item) => item._id === applicationId);

  if (applicationId && !application) {
    return NextResponse.json({ error: "Boutique application was not found" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  if (application && !ownsApplication(application, auth)) {
    return NextResponse.json({ error: "Not authorized for this boutique application" }, { status: 403, headers: NO_STORE_HEADERS });
  }

  const products = await getPartnerProducts();
  const filtered = applicationId
    ? products.filter((product) => product.applicationId === applicationId)
    : [];

  return NextResponse.json({ products: filtered }, { headers: NO_STORE_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Sign in with the partner account before sending products for approval." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const body = await req.json();
    const applicationId = cleanString(body.applicationId);

    if (!applicationId) {
      return NextResponse.json({ error: "Application id is required" }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const applications = await getBoutiqueApplications();
    const application = applications.find((item) => item._id === applicationId);
    if (!application) {
      return NextResponse.json({ error: "Boutique application was not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }

    if (!ownsApplication(application, auth)) {
      return NextResponse.json(
        { error: "Not authorized for this boutique application" },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    const name = cleanString(body.name);
    const category = cleanString(body.category).toLowerCase().replace(/\s+/g, "-");
    const price = Number(body.price ?? 0);
    const images = parseList(body.images);
    if (!name || !category || !Number.isFinite(price) || price <= 0 || images.length === 0) {
      return NextResponse.json(
        { error: "Product name, category, price, and at least one image are required" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const product = await createPartnerProductDraft({
      applicationId,
      partnerUserId: auth.userId ?? application.partnerUserId,
      partnerEmail: auth.email ?? application.email,
      boutiqueName: application.boutiqueName,
      partnerName: application.ownerName,
      phone: application.phone,
      name,
      category,
      price: Math.max(0, Math.floor(price)),
      images,
      size: parseList(body.size),
      colors: parseList(body.colors),
      description: cleanString(body.description) || undefined,
      material: cleanString(body.material) || undefined,
      stock: Number.isFinite(Number(body.stock)) ? Math.max(0, Math.floor(Number(body.stock))) : undefined,
    });
    notifyPartnerProductSubmitted(product);

    return NextResponse.json({ success: true, product }, { status: 201, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Partner product submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit partner product" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

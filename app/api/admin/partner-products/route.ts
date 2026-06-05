import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthFromRequest } from "@/lib/auth";
import { ALL_CATEGORY_META } from "@/lib/commerce";
import { getProductById } from "@/lib/getAllProducts";
import { getPartnerProducts, reviewPartnerProduct } from "@/lib/partnerProducts";
import { notifyPartnerProductReviewed } from "@/lib/notifications";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

const CATALOG_REVALIDATION_PATHS = [
  "/",
  "/shop",
  "/collection",
  ...ALL_CATEGORY_META.map((category) => category.href),
];

function revalidateCatalog(productId?: string) {
  for (const path of new Set(CATALOG_REVALIDATION_PATHS)) {
    revalidatePath(path);
  }

  if (productId) {
    revalidatePath(`/product/${encodeURIComponent(productId)}`);
  }
}

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const products = await getPartnerProducts();
  const filtered = status
    ? products.filter((product) => product.status === status)
    : products;

  return NextResponse.json({ products: filtered }, { headers: NO_STORE_HEADERS });
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const productId = String(body.productId ?? "").trim();
    const action = String(body.action ?? "").trim();

    if (!productId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "productId and valid action are required" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const product = await reviewPartnerProduct(productId, {
      status: action === "approve" ? "approved" : "rejected",
      reviewNote: typeof body.reviewNote === "string" ? body.reviewNote : undefined,
      reviewedBy: auth.email,
    });

    if (!product) {
      return NextResponse.json({ error: "Partner product not found" }, { status: 404, headers: NO_STORE_HEADERS });
    }

    let liveProduct = null;
    if (product.status === "approved") {
      liveProduct = await getProductById(product.productId);
      if (!liveProduct) {
        return NextResponse.json(
          { error: "Product was approved but could not be published to Shop. Try republishing it." },
          { status: 500, headers: NO_STORE_HEADERS }
        );
      }

      revalidateCatalog(product.productId);
    }
    notifyPartnerProductReviewed(product);

    return NextResponse.json({ success: true, product, liveProduct }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Partner product review error:", error);
    return NextResponse.json(
      { error: "Failed to review partner product" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

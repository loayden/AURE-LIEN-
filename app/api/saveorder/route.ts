import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { attachUserCookie } from "@/lib/userSession";
import { appendOrder, getOrdersJson } from "@/lib/orderStorage";
import { getProductById } from "@/lib/getAllProducts";
import { notifyOrderPlaced } from "@/lib/notifications";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

type CustomerInfo = {
  email: string;
  name: string;
  address: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  newsletter?: boolean;
  shippingMethod?: string;
  shippingCost?: number;
  firstName?: string;
  lastName?: string;
};

type Order = {
  _id: string;
  id: string;
  userId: string;
  items: OrderItem[];
  products: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
  }>;
  total: number;
  totalPrice: number;
  customer: CustomerInfo;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  couponCode?: string;
  couponDiscount?: number;
  giftWrap?: boolean;
  giftMessage?: string;
  loyaltyRedeemed?: number;
  loyaltyDiscount?: number;
};

const SHIPPING_OPTIONS: Record<string, number> = {
  within_egypt: 75,
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const limited = await rateLimitResponse(req, RATE_LIMITS.saveorder);
    if (limited) return limited;
    if (!isOriginAllowed(req)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const { userId, isNew } = await resolveUserId(req);

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ Invalid JSON in saveorder POST:", parseError);
      return NextResponse.json(
        { error: "Invalid request body - must be valid JSON" },
        { status: 400 }
      );
    }

    const { saveOrderSchema, zodErrorMessage } = await import("@/lib/validate");
    const zodParsed = saveOrderSchema.safeParse(body);
    if (!zodParsed.success) {
      return NextResponse.json({ error: zodErrorMessage(zodParsed.error) }, { status: 400 });
    }

    // ✅ Idempotency first: retries return the original order before any validation/consumption.
    const earlyRawKey =
      (typeof (zodParsed.data as Record<string, unknown>).idempotencyKey === "string" &&
        String((zodParsed.data as Record<string, unknown>).idempotencyKey).trim()) ||
      req.headers.get("Idempotency-Key")?.trim() ||
      "";
    const earlySanitized = earlyRawKey.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
    if (earlySanitized) {
      try {
        const existingOrders = (await getOrdersJson()) as Order[];
        const existing = existingOrders.find(
          (o) => String(o._id ?? o.id) === `order-${userId.slice(0, 8)}-${earlySanitized}` && o.userId === userId
        );
        if (existing) {
          const res = NextResponse.json(
            {
              success: true,
              orderId: existing._id,
              message: "Order already placed",
              total: existing.totalPrice ?? existing.total,
              itemsCount: existing.items?.length ?? 0,
              paymentStatus: existing.paymentStatus,
              status: existing.status,
              deduped: true,
            },
            { status: 200 }
          );
          if (isNew) attachUserCookie(res, userId);
          return res;
        }
      } catch {
        // fall through to normal creation
      }
    }

    const { items, total, customerInfo, paymentMethod } = {
      items: zodParsed.data.items ?? [],
      total: zodParsed.data.total ?? 0,
      customerInfo: zodParsed.data.customerInfo ?? {},
      paymentMethod: zodParsed.data.paymentMethod ?? "cod",
    };

    console.log("📥 Received order data:", {
      itemsCount: items.length,
      total,
      customerEmail: customerInfo.email,
    });

    // ✅ VALIDATION: Check items array
    if (!Array.isArray(items)) {
      console.error("❌ Items is not an array:", typeof items);
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      console.warn("❌ Order contains no items");
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    // ✅ VALIDATION: Check customer info
    const hasCustomerName =
      Boolean(customerInfo.name) ||
      Boolean(customerInfo.firstName) ||
      Boolean(customerInfo.lastName);

    if (!customerInfo.email || !hasCustomerName || !customerInfo.address) {
      console.error("❌ Missing required customer information:", {
        hasEmail: !!customerInfo.email,
        hasName: hasCustomerName,
        hasAddress: !!customerInfo.address,
      });
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 }
      );
    }

    // ✅ VALIDATION: Validate each item. Server-side catalog lookup below is the
    // source of truth for names, images, and prices.
    for (const item of items) {
      if (!item.productId || !isPositiveInteger(Number(item.quantity))) {
        console.error("❌ Invalid item structure:", item);
        return NextResponse.json(
          { error: "Each item must have productId and a positive whole quantity" },
          { status: 400 }
        );
      }
    }

    // ✅ VALIDATION: Validate total
    if (typeof total !== "number" || total < 0) {
      console.error("❌ Invalid total:", total);
      return NextResponse.json(
        { error: "Total must be a positive number" },
        { status: 400 }
      );
    }

    const normalizedCustomer: CustomerInfo = {
      email: String(customerInfo.email ?? "").trim(),
      firstName: String(customerInfo.firstName ?? "").trim(),
      lastName: String(customerInfo.lastName ?? "").trim(),
      name:
        String(customerInfo.name ?? "").trim() ||
        [customerInfo.firstName, customerInfo.lastName].filter(Boolean).join(" ").trim(),
      address: String(customerInfo.address ?? "").trim(),
      apartment: String(customerInfo.apartment ?? "").trim(),
      city: String(customerInfo.city ?? "").trim(),
      postalCode: String(customerInfo.postalCode ?? customerInfo.zipCode ?? "").trim(),
      country: String(customerInfo.country ?? "").trim(),
      phone: String(customerInfo.phone ?? "").trim(),
      newsletter: Boolean(customerInfo.newsletter),
      shippingMethod: String(customerInfo.shippingMethod ?? "within_egypt").trim(),
      shippingCost: 0,
    };
    normalizedCustomer.shippingCost =
      SHIPPING_OPTIONS[normalizedCustomer.shippingMethod || "within_egypt"] ?? 0;

    let resolvedItems: OrderItem[];
    try {
      resolvedItems = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(String(item.productId));
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }
          const quantity = Number(item.quantity);
          if (typeof product.stock === "number" && product.stock <= 0) {
            throw new Error(`${product.name} is sold out`);
          }
          if (typeof product.stock === "number" && quantity > product.stock) {
            throw new Error(`Only ${product.stock} available for ${product.name}`);
          }
          return {
            productId: product._id,
            name: product.name,
            price: Number(product.price),
            quantity,
            size: item.size || "One Size",
            color: item.color || "Default",
            image: product.images?.[0] ?? "/images/placeholder.svg",
          };
        })
      );
    } catch (catalogError) {
      return NextResponse.json(
        { error: catalogError instanceof Error ? catalogError.message : "Unable to validate order items" },
        { status: 400 }
      );
    }

    // ✅ CALCULATE TOTAL SERVER-SIDE (don't trust frontend)
    const itemsTotal = resolvedItems.reduce((sum: number, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // ✅ Coupon (validated server-side, consumed atomically later).
    const GIFT_WRAP_FEE = 50;
    const rawCouponCode = String(zodParsed.data.couponCode ?? "").trim();
    let couponDiscount = 0;
    let couponCode = "";
    if (rawCouponCode) {
      const { quoteCoupon } = await import("@/lib/coupons");
      const quoted = await quoteCoupon(rawCouponCode, itemsTotal);
      if ("error" in quoted) {
        return NextResponse.json({ error: quoted.error }, { status: 400 });
      }
      couponCode = quoted.quote.code;
      couponDiscount = quoted.quote.discount;
    }

    // ✅ Loyalty redemption (100 pts = EGP 10 steps, capped by balance and subtotal).
    const requestedPoints = Math.max(0, Math.floor(Number(zodParsed.data.loyaltyPoints ?? 0)));
    let loyaltyRedeemed = 0;
    let loyaltyDiscount = 0;
    if (requestedPoints > 0) {
      const { hasConfiguredMongoUri } = await import("@/lib/mongoEnv");
      if (!hasConfiguredMongoUri()) {
        return NextResponse.json({ error: "Loyalty redemption is unavailable right now" }, { status: 400 });
      }
      const { availablePoints } = await import("@/lib/loyaltyLedger");
      const { LOYALTY_REDEEM_STEP, redeemValueForPoints } = await import("@/lib/loyalty");
      const balance = await availablePoints(userId);
      const usable = Math.floor(Math.min(requestedPoints, balance) / LOYALTY_REDEEM_STEP) * LOYALTY_REDEEM_STEP;
      if (usable <= 0) {
        return NextResponse.json({ error: `Not enough points (balance ${balance})` }, { status: 400 });
      }
      loyaltyRedeemed = usable;
      loyaltyDiscount = Math.min(redeemValueForPoints(usable), Math.max(0, itemsTotal - couponDiscount));
      loyaltyRedeemed = Math.floor(loyaltyDiscount / 10) * LOYALTY_REDEEM_STEP;
      loyaltyDiscount = redeemValueForPoints(loyaltyRedeemed);
      if (loyaltyRedeemed <= 0) {
        return NextResponse.json({ error: "Points do not cover any discount on this order" }, { status: 400 });
      }
    }

    const giftWrap = Boolean(zodParsed.data.giftWrap);
    const giftMessage = String(zodParsed.data.giftMessage ?? "").slice(0, 500);
    const giftFee = giftWrap ? GIFT_WRAP_FEE : 0;

    const calculatedTotal = Math.max(
      0,
      itemsTotal - couponDiscount - loyaltyDiscount + normalizedCustomer.shippingCost + giftFee
    );

    console.log(`✅ Total validation: frontend=${total.toFixed(2)}, server=${calculatedTotal.toFixed(2)}`);

    // Allow small rounding differences (cents)
    if (Math.abs(calculatedTotal - total) > 0.01) {
      console.warn(`⚠️ Total mismatch - using server-calculated total`);
    }

    // ✅ Step 1: Create new order payload (idempotency was already checked up front)
    const rawIdempotencyKey =
      (typeof body?.idempotencyKey === "string" && body.idempotencyKey.trim()) ||
      req.headers.get("Idempotency-Key")?.trim() ||
      "";
    const sanitizedKey = rawIdempotencyKey.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
    const orderId = sanitizedKey
      ? `order-${userId.slice(0, 8)}-${sanitizedKey}`
      : `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const products = resolvedItems.map((item) => ({
      _id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "One Size",
      color: item.color || "Default",
      image: item.image || "",
    }));

    const newOrder: Order = {
      _id: orderId,
      id: orderId,
      userId,
      items: products.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "One Size",
        color: item.color || "Default",
        image: item.image || "",
      })),
      products,
      total: calculatedTotal, // Use server-calculated total
      totalPrice: calculatedTotal,
      customer: normalizedCustomer,
      createdAt: new Date().toISOString(),
      status: paymentMethod === "card" ? "pending" : "pending",
      paymentStatus: paymentMethod === "card" ? "unpaid" : "pending",
      paymentMethod: paymentMethod === "card" ? "card" : "cash_on_delivery",
      couponCode,
      couponDiscount,
      giftWrap,
      giftMessage,
      loyaltyRedeemed,
      loyaltyDiscount,
    };

    console.log(`✅ Created new order ${newOrder._id} with ${items.length} items`);

    // ✅ Atomic stock reservation (Mongo only; no-op elsewhere). Prevents oversell races.
    const { tryDecrementStock, restoreStock } = await import("@/lib/inventory");
    const reservation = await tryDecrementStock(
      resolvedItems.map((item) => ({ productId: item.productId, quantity: item.quantity, name: item.name }))
    );
    if (!reservation.ok) {
      const first = reservation.issues[0];
      return NextResponse.json(
        { error: `Only ${first.available} available for ${first.name}` },
        { status: 409 }
      );
    }
    const restoreAll = () =>
      restoreStock(resolvedItems.map((item) => ({ productId: item.productId, quantity: item.quantity })));

    // ✅ Consume coupon atomically (a concurrent checkout may have exhausted it).
    let couponConsumed = false;
    if (couponCode) {
      const { consumeCoupon } = await import("@/lib/coupons");
      couponConsumed = await consumeCoupon(couponCode);
      if (!couponConsumed) {
        await restoreAll();
        return NextResponse.json({ error: "Coupon is no longer available" }, { status: 409 });
      }
    }

    // ✅ Reserve loyalty points before the order exists (unique per order → no double spend).
    let loyaltyReserved = false;
    if (loyaltyRedeemed > 0) {
      const { recordRedemption } = await import("@/lib/loyaltyLedger");
      loyaltyReserved = await recordRedemption(userId, orderId, loyaltyRedeemed);
      if (!loyaltyReserved) {
        await restoreAll();
        if (couponConsumed) {
          const { releaseCoupon } = await import("@/lib/coupons");
          await releaseCoupon(couponCode);
        }
        return NextResponse.json({ error: "Could not reserve loyalty points" }, { status: 409 });
      }
    }

    // ✅ Step 2: Persist the order in the shared store
    try {
      await appendOrder(newOrder);
      console.log(`✅ Order ${newOrder._id} saved successfully to shared storage`);
      notifyOrderPlaced(newOrder);
    } catch (writeError) {
      console.error("❌ Failed to save order to shared storage:", writeError instanceof Error ? writeError.message : String(writeError));
      await restoreAll();
      if (couponConsumed) {
        const { releaseCoupon } = await import("@/lib/coupons");
        await releaseCoupon(couponCode);
      }
      if (loyaltyReserved) {
        const { voidRedemption } = await import("@/lib/loyaltyLedger");
        await voidRedemption(orderId);
      }
      return NextResponse.json(
        { error: "Failed to save order to database" },
        { status: 500 }
      );
    }

    // ✅ Return success
    const res = NextResponse.json(
      {
        success: true,
        orderId: newOrder._id,
        message: "Order placed successfully",
        total: calculatedTotal,
        itemsCount: items.length,
        paymentStatus: newOrder.paymentStatus,
        status: newOrder.status,
      },
      { status: 201 }
    );

    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("❌ Saveorder POST error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await resolveUserId(req);

    let orders: Order[] = [];
    try {
      orders = (await getOrdersJson()) as Order[];
    } catch (readError) {
      console.error("❌ Failed to read orders from storage:", readError);
      return NextResponse.json(
        { orders: [], error: "Failed to fetch orders" },
        { status: 200 }
      );
    }

    // Filter orders for this user
    const userOrders = orders.filter((o) => o.userId === userId);
    console.log(`✅ Retrieved ${userOrders.length} orders for user ${userId}`);

    const url = new URL(req.url);
    if (url.searchParams.has("page") || url.searchParams.has("limit")) {
      const { paginateArray, parsePaginationParams } = await import("@/lib/pagination");
      const { page, limit } = parsePaginationParams(url);
      const { data, pagination } = paginateArray(userOrders, page, limit);
      return NextResponse.json({ orders: data, pagination }, { status: 200 });
    }

    return NextResponse.json({ orders: userOrders }, { status: 200 });
  } catch (error) {
    console.error("❌ Saveorder GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { orders: [], error: "Failed to fetch orders" },
      { status: 200 }
    );
  }
}

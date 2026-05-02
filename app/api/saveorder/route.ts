import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { attachUserCookie } from "@/lib/userSession";
import { appendOrder, getOrdersJson } from "@/lib/orderStorage";
import { getAllProducts } from "@/lib/getAllProducts";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

const SHIPPING_COST_WITHIN_EGYPT = 75;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  paymentProvider: string;
  paidAt: string | null;
};

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

function getServerShippingCost(shippingMethod: string): number {
  return shippingMethod === "within_egypt" ? SHIPPING_COST_WITHIN_EGYPT : 0;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
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

    const { items = [], total = 0, customerInfo = {} } = body;
    const rawCustomer =
      typeof customerInfo === "object" && customerInfo !== null ? customerInfo : {};

    console.log("📥 Received order data:", {
      itemsCount: Array.isArray(items) ? items.length : 0,
      total,
      customerEmail: rawCustomer.email,
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

    const normalizedCustomer: CustomerInfo = {
      email: String(rawCustomer.email ?? "").trim(),
      firstName: String(rawCustomer.firstName ?? "").trim(),
      lastName: String(rawCustomer.lastName ?? "").trim(),
      name:
        String(rawCustomer.name ?? "").trim() ||
        [rawCustomer.firstName, rawCustomer.lastName].filter(Boolean).join(" ").trim(),
      address: String(rawCustomer.address ?? "").trim(),
      apartment: String(rawCustomer.apartment ?? "").trim(),
      city: String(rawCustomer.city ?? "").trim(),
      postalCode: String(rawCustomer.postalCode ?? rawCustomer.zipCode ?? "").trim(),
      country: String(rawCustomer.country ?? "").trim(),
      phone: String(rawCustomer.phone ?? "").trim(),
      newsletter: Boolean(rawCustomer.newsletter),
      shippingMethod: String(rawCustomer.shippingMethod ?? "").trim(),
      shippingCost: 0,
    };

    normalizedCustomer.shippingCost = getServerShippingCost(normalizedCustomer.shippingMethod ?? "");

    const hasCustomerName =
      Boolean(normalizedCustomer.name) ||
      Boolean(normalizedCustomer.firstName) ||
      Boolean(normalizedCustomer.lastName);

    if (!normalizedCustomer.email || !hasCustomerName || !normalizedCustomer.address) {
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(normalizedCustomer.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!normalizedCustomer.phone || normalizedCustomer.phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const catalog = await getAllProducts();
    const catalogById = new Map(catalog.map((product) => [String(product._id), product]));
    const serverItems: OrderItem[] = [];

    for (const item of items) {
      const productId = String(item?.productId ?? item?._id ?? "").trim();
      const quantity = Number(item?.quantity);

      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: "Each item must reference a product and use a positive integer quantity" },
          { status: 400 }
        );
      }

      const product = catalogById.get(productId);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${productId}` },
          { status: 400 }
        );
      }

      const unitPrice = Number(product.price ?? 0);
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        return NextResponse.json(
          { error: `Product is not available for checkout: ${productId}` },
          { status: 400 }
        );
      }

      const availableStock = typeof product.stock === "number" ? product.stock : null;
      if (availableStock === 0 || (availableStock !== null && quantity > availableStock)) {
        return NextResponse.json(
          { error: `Requested quantity exceeds available stock: ${product.name}` },
          { status: 409 }
        );
      }

      serverItems.push({
        productId,
        name: product.name,
        price: unitPrice,
        quantity,
        size: String(item?.size ?? "One Size").trim() || "One Size",
        color: String(item?.color ?? "Default").trim() || "Default",
        image: product.images?.[0] ?? "/images/placeholder.svg",
      });
    }

    const itemsTotal = serverItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculatedTotal = itemsTotal + normalizedCustomer.shippingCost;

    if (typeof total === "number" && Math.abs(calculatedTotal - total) > 0.01) {
      console.warn("Order total mismatch; using server catalog total", {
        clientTotal: total,
        serverTotal: calculatedTotal,
      });
    }

    // ✅ Step 1: Create new order payload
    const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const products = serverItems.map((item) => ({
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
      status: "pending",
      paymentStatus: "pending",
      paymentProvider: "manual",
      paidAt: null,
    };

    console.log(`✅ Created new order ${newOrder._id} with ${serverItems.length} items`);

    // ✅ Step 2: Persist the order in the shared store
    try {
      await appendOrder(newOrder);
      console.log(`✅ Order ${newOrder._id} saved successfully to shared storage`);
    } catch (writeError) {
      console.error("❌ Failed to save order to shared storage:", writeError instanceof Error ? writeError.message : String(writeError));
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
        message: "Order received and pending confirmation",
        total: calculatedTotal,
        itemsCount: serverItems.length,
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

    return NextResponse.json({ orders: userOrders }, { status: 200 });
  } catch (error) {
    console.error("❌ Saveorder GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { orders: [], error: "Failed to fetch orders" },
      { status: 200 }
    );
  }
}

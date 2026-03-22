import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { attachUserCookie } from "@/lib/userSession";
import { appendOrder, getOrdersJson } from "@/lib/orderStorage";

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
};

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
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

    // ✅ VALIDATION: Validate each item
    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        console.error("❌ Invalid item structure:", item);
        return NextResponse.json(
          { error: "Each item must have productId, name, price, and quantity" },
          { status: 400 }
        );
      }

      if (item.quantity < 1) {
        console.error("❌ Invalid quantity:", item.quantity);
        return NextResponse.json(
          { error: "Item quantity must be at least 1" },
          { status: 400 }
        );
      }

      if (item.price < 0) {
        console.error("❌ Invalid price:", item.price);
        return NextResponse.json(
          { error: "Item price cannot be negative" },
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
      shippingMethod: String(customerInfo.shippingMethod ?? "").trim(),
      shippingCost: Number(customerInfo.shippingCost ?? 0),
    };

    // ✅ CALCULATE TOTAL SERVER-SIDE (don't trust frontend)
    const itemsTotal = items.reduce((sum: number, item: OrderItem) => {
      return sum + item.price * item.quantity;
    }, 0);
    const calculatedTotal = itemsTotal + normalizedCustomer.shippingCost;

    console.log(`✅ Total validation: frontend=${total.toFixed(2)}, server=${calculatedTotal.toFixed(2)}`);

    // Allow small rounding differences (cents)
    if (Math.abs(calculatedTotal - total) > 0.01) {
      console.warn(`⚠️ Total mismatch - using server-calculated total`);
    }

    // ✅ Step 1: Create new order payload
    const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const products = items.map((item: OrderItem) => ({
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
    };

    console.log(`✅ Created new order ${newOrder._id} with ${items.length} items`);

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
        message: "Order placed successfully",
        total: calculatedTotal,
        itemsCount: items.length,
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

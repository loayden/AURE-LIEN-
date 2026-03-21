import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { attachUserCookie } from "@/lib/userSession";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

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
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
};

type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  createdAt: string;
  status: string;
};

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

async function getOrdersFromRedis(): Promise<Order[]> {
  try {
    const ordersJson = await redis.get("orders");
    if (!ordersJson) return [];
    return JSON.parse(ordersJson as string);
  } catch (error) {
    console.warn("⚠️ Failed to read orders from Redis:", error);
    return [];
  }
}

async function saveOrdersToRedis(orders: Order[]): Promise<void> {
  try {
    await redis.set("orders", JSON.stringify(orders));
    console.log("✅ Orders saved to Redis");
  } catch (error) {
    console.error("❌ Failed to save orders to Redis:", error);
    throw error;
  }
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
    if (!customerInfo.email || !customerInfo.name || !customerInfo.address) {
      console.error("❌ Missing required customer information:", {
        hasEmail: !!customerInfo.email,
        hasName: !!customerInfo.name,
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

    // ✅ CALCULATE TOTAL SERVER-SIDE (don't trust frontend)
    const calculatedTotal = items.reduce((sum: number, item: OrderItem) => {
      return sum + item.price * item.quantity;
    }, 0);

    console.log(`✅ Total validation: frontend=${total.toFixed(2)}, server=${calculatedTotal.toFixed(2)}`);

    // Allow small rounding differences (cents)
    if (Math.abs(calculatedTotal - total) > 0.01) {
      console.warn(`⚠️ Total mismatch - using server-calculated total`);
    }

    // ✅ Step 1: Read existing orders from Redis
    let orders: Order[] = [];
    try {
      orders = await getOrdersFromRedis();
      console.log(`✅ Read ${orders.length} existing orders from Redis`);
    } catch (readError) {
      console.error("❌ Failed to read orders from Redis:", readError instanceof Error ? readError.message : String(readError));
      return NextResponse.json(
        { error: "Failed to read orders database" },
        { status: 500 }
      );
    }

    // ✅ Step 2: Create new order
    const newOrder: Order = {
      _id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items: items.map((item: OrderItem) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "One Size",
        color: item.color || "Default",
        image: item.image || "",
      })),
      total: calculatedTotal, // Use server-calculated total
      customerInfo: {
        email: customerInfo.email,
        name: customerInfo.name,
        address: customerInfo.address,
        city: customerInfo.city || "",
        state: customerInfo.state || "",
        zipCode: customerInfo.zipCode || "",
        phone: customerInfo.phone || "",
      },
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    console.log(`✅ Created new order ${newOrder._id} with ${items.length} items`);

    orders.push(newOrder);

    // ✅ Step 3: Write updated orders back to Redis
    try {
      await saveOrdersToRedis(orders);
      console.log(`✅ Order ${newOrder._id} saved successfully to Redis`);
    } catch (writeError) {
      console.error("❌ Failed to save order to Redis:", writeError instanceof Error ? writeError.message : String(writeError));
      return NextResponse.json(
        { error: "Failed to save order to database" },
        { status: 500 }
      );
    }

    // ✅ Step 4: Send confirmation email (non-blocking)
    try {
      fetch(`${req.nextUrl.origin}/api/email/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: newOrder._id,
          email: customerInfo.email,
          items,
          total: calculatedTotal,
        }),
      }).catch((err) => console.warn("⚠️ Email send failed (non-blocking):", err));

      console.log(`✅ Email send initiated for order ${newOrder._id}`);
    } catch (emailError) {
      console.warn("⚠️ Email scheduling failed:", emailError);
      // Don't return error - email is non-critical
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
      orders = await getOrdersFromRedis();
    } catch (readError) {
      console.error("❌ Failed to read orders from Redis:", readError);
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
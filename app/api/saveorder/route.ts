import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { attachUserCookie } from "@/lib/userSession";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

type Order = {
  _id: string;
  userId: string;
  items: Array<any>;
  total: number;
  customerInfo: Record<string, unknown>;
  createdAt: string;
  status?: string;
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
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { items = [], total = 0, customerInfo = {} } = body;

    // ✅ Step 1: Validate input
    if (!Array.isArray(items) || items.length === 0) {
      console.warn("⚠️ No items in order");
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (typeof total !== "number" || total <= 0) {
      console.warn("⚠️ Invalid order total:", total);
      return NextResponse.json(
        { error: "Order total must be a positive number" },
        { status: 400 }
      );
    }

    // ✅ Step 2: Read existing orders from Redis
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

    // ✅ Step 3: Create new order
    const newOrder: Order = {
      _id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items,
      total,
      customerInfo,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    orders.push(newOrder);
    console.log(`✅ Created new order ${newOrder._id}`);

    // ✅ Step 4: Write updated orders back to Redis
    try {
      await saveOrdersToRedis(orders);
      console.log(`✅ Order ${newOrder._id} saved successfully`);
    } catch (writeError) {
      console.error("❌ Failed to save to orders Redis:", writeError instanceof Error ? writeError.message : String(writeError));
      return NextResponse.json(
        { error: "Failed to save order to database" },
        { status: 500 }
      );
    }

    // ✅ Step 5: Send email (non-blocking)
    try {
      // Non-blocking email send - don't wait for it
      fetch(`${req.nextUrl.origin}/api/email/send-order-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: newOrder._id,
          email: customerInfo.email,
          items,
          total,
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
        message: "Order saved successfully",
      },
      { status: 201 }
    );

    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (error) {
    console.error("❌ Saveorder POST error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to save order" },
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
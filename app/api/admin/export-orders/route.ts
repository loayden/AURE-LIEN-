import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrdersJson, getOrdersDataJson } from "@/lib/orderStorage";

/**
 * GET /api/admin/export-orders
 * Admin only. Returns all orders as JSON file so you can save to your PC.
 * Works with local data/ or Vercel Blob when deployed.
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  try {
    const [orders, ordersData] = await Promise.all([getOrdersJson(), getOrdersDataJson()]);
    const payload = {
      exportedAt: new Date().toISOString(),
      count: orders.length,
      orders,
      ordersData,
    };
    const json = JSON.stringify(payload, null, 2);
    const filename = `orders-export-${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("Export orders error:", e);
    return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
  }
}

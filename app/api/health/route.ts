import { NextResponse } from "next/server";
import { getEnvCheck } from "@/lib/envCheck";
import { hasConfiguredMongoUri } from "@/lib/mongoEnv";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * Read-only health check. Never writes, never leaks secret values.
 * 200 = ok/degraded (see `checks`), 500 only if the route itself crashes.
 */
export async function GET() {
  try {
    const checks = getEnvCheck();
    let mongoOk = false;
    let products = -1;
    if (hasConfiguredMongoUri()) {
      try {
        const connectDB = (await import("@/lib/connectDB")).default;
        const mongoose = await import("mongoose");
        await connectDB();
        mongoOk = mongoose.default.connection.readyState === 1;
        const Product = (await import("@/models/Product")).default;
        products = await Product.countDocuments({}).catch(() => -1);
      } catch {
        mongoOk = false;
      }
    }
    const degraded =
      !checks.mongo ||
      !checks.jwt ||
      !mongoOk ||
      !checks.publicUrl ||
      checks.stripe === "missing";
    return NextResponse.json(
      {
        ok: !degraded,
        degraded,
        checks: { ...checks, mongoConnected: mongoOk, productCount: products },
        watch: [
          "Missing MongoDB connection string = set DATABASE_URL in Vercel",
          "JWT_SECRET is required in production = set JWT_SECRET in Vercel",
          "Stripe not configured = set STRIPE_SECRET_KEY in Vercel",
        ],
      },
      { status: 200, headers: NO_STORE }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message.slice(0, 200) : "health failed" },
      { status: 500, headers: NO_STORE }
    );
  }
}

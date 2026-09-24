import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import BackInStock from "@/models/BackInStock";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const schema = z.object({
  productId: z.string().min(1),
  email: z.string().email("Valid email required"),
});

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Notifications storage not configured" }, { status: 503, headers: NO_STORE });
  }
  await connectDB();
  try {
    await BackInStock.create({ productId: parsed.data.productId, email: parsed.data.email.toLowerCase().trim() });
  } catch {
    // already subscribed — treat as success (idempotent)
  }
  return NextResponse.json({ success: true, message: "We will email you when it is back" }, { status: 201, headers: NO_STORE });
}

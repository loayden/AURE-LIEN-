import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Coupon from "@/models/Coupon";
import { quoteCoupon } from "@/lib/coupons";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** POST { code, subtotal } → quote discount (no usage consumed). */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({ code: z.string().min(1).max(32), subtotal: z.number().min(0).max(10000000) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  const result = await quoteCoupon(parsed.data.code, parsed.data.subtotal);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400, headers: NO_STORE });
  }
  return NextResponse.json({ coupon: result.quote }, { headers: NO_STORE });
}

/** GET: admin list. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) return NextResponse.json({ coupons: [] }, { headers: NO_STORE });
  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ coupons }, { headers: NO_STORE });
}

/** PUT: admin create/update. DELETE: deactivate (?code=). */
export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = z.object({
    code: z.string().min(2).max(32),
    kind: z.enum(["percent", "fixed"]),
    value: z.number().min(0.01).max(100000),
    minSubtotal: z.number().min(0).max(10000000).optional().default(0),
    maxUses: z.number().int().min(0).max(1000000).optional().default(0),
    active: z.boolean().optional().default(true),
    expiresAt: z.string().optional(),
  }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid coupon" }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Coupons storage not configured" }, { status: 503, headers: NO_STORE });
  }
  if (parsed.data.kind === "percent" && parsed.data.value > 90) {
    return NextResponse.json({ error: "Percent coupons cap at 90%" }, { status: 400, headers: NO_STORE });
  }
  await connectDB();
  const code = parsed.data.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
  const coupon = await Coupon.findOneAndUpdate(
    { code },
    {
      code,
      kind: parsed.data.kind,
      value: parsed.data.value,
      minSubtotal: parsed.data.minSubtotal,
      maxUses: parsed.data.maxUses,
      active: parsed.data.active,
      ...(parsed.data.expiresAt ? { expiresAt: new Date(parsed.data.expiresAt) } : {}),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await logAdminAction({ action: "admin.coupon.upsert", actorId: auth.userId, actorEmail: auth.email, targetType: "coupon", targetId: code, ip: getClientIpFromHeaders(req.headers) });
  return NextResponse.json({ success: true, coupon }, { headers: NO_STORE });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const code = String(new URL(req.url).searchParams.get("code") ?? "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400, headers: NO_STORE });
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Coupons storage not configured" }, { status: 503, headers: NO_STORE });
  }
  await connectDB();
  await Coupon.findOneAndUpdate({ code }, { $set: { active: false } });
  await logAdminAction({ action: "admin.coupon.deactivate", actorId: auth.userId, actorEmail: auth.email, targetType: "coupon", targetId: code, ip: getClientIpFromHeaders(req.headers) });
  return NextResponse.json({ success: true }, { headers: NO_STORE });
}

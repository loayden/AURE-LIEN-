import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { getPartnerProducts } from "@/lib/partnerProducts";
import { getOrdersJson } from "@/lib/orderStorage";
import { buildPartnerWallet } from "@/lib/partnerWallet";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Payout from "@/models/Payout";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function owns(application: { partnerUserId?: string; email?: string }, auth: NonNullable<Awaited<ReturnType<typeof getAuthFromRequest>>>): boolean {
  if (auth.role === "admin") return true;
  if (application.partnerUserId && application.partnerUserId === auth.userId) return true;
  return Boolean(!application.partnerUserId && application.email && application.email.toLowerCase() === auth.email?.toLowerCase());
}

export async function availableBalance(applicationId: string): Promise<{ available: number; currency: string }> {
  const [applications, products, orders, payouts] = await Promise.all([
    getBoutiqueApplications(),
    getPartnerProducts(),
    getOrdersJson(),
    (async () => {
      if (!hasConfiguredMongoUri()) return [];
      await connectDB();
      return Payout.find({ applicationId, status: { $in: ["requested", "approved", "paid"] } }).lean();
    })(),
  ]);
  const application = applications.find((a) => a._id === applicationId);
  if (!application) return { available: 0, currency: "EGP" };
  const wallet = buildPartnerWallet({
    application,
    products: products.filter((p) => p.applicationId === applicationId),
    orders,
  });
  const reserved = (payouts as Array<{ amount?: number }>).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  return { available: Math.max(0, Math.round((wallet.summary?.available ?? 0) - reserved)), currency: "EGP" };
}

/** GET: my payouts + available balance. POST: request a payout. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  const applicationId = String(new URL(req.url).searchParams.get("applicationId") ?? "").trim();
  if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400, headers: NO_STORE });
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ payouts: [], available: 0, currency: "EGP" }, { headers: NO_STORE });
  }
  const applications = await getBoutiqueApplications();
  const application = applications.find((a) => a._id === applicationId);
  if (!application || !owns(application, auth)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  await connectDB();
  const payouts = await Payout.find({ $or: [{ applicationId }, { partnerUserId: auth.userId }] }).sort({ createdAt: -1 }).limit(50).lean();
  const { available, currency } = await availableBalance(applicationId);
  return NextResponse.json({ payouts, available, currency }, { headers: NO_STORE });
}

const requestSchema = z.object({
  applicationId: z.string().min(1),
  amount: z.number().min(1, "Amount must be at least EGP 1").max(1000000),
});

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Sign in first" }, { status: 401, headers: NO_STORE });
  const body = await req.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Payouts storage not configured" }, { status: 503, headers: NO_STORE });
  }
  const applications = await getBoutiqueApplications();
  const application = applications.find((a) => a._id === parsed.data.applicationId);
  if (!application || !owns(application, auth)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const { available } = await availableBalance(application._id);
  if (parsed.data.amount > available) {
    return NextResponse.json({ error: `Available balance is EGP ${available.toFixed(2)}` }, { status: 409, headers: NO_STORE });
  }
  await connectDB();
  const existing = await Payout.findOne({ applicationId: application._id, partnerUserId: auth.userId, status: "requested" }).lean();
  if (existing) {
    return NextResponse.json({ success: true, deduped: true, payout: existing }, { headers: NO_STORE });
  }
  const payout = await Payout.create({
    _id: `payout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    applicationId: application._id,
    partnerUserId: auth.userId,
    amount: Math.round(parsed.data.amount * 100) / 100,
    currency: "EGP",
    status: "requested",
  });
  return NextResponse.json({ success: true, payout }, { status: 201, headers: NO_STORE });
}

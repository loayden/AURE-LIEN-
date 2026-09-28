import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Reel from "@/models/Reel";
import { randomUUID } from "crypto";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const reelSchema = z.object({
  title: z.string().max(120).optional().default(""),
  videoUrl: z.string().min(1).max(2000),
  posterUrl: z.string().max(2000).optional().default(""),
  productIds: z.array(z.string().min(1).max(200)).max(10).optional().default([]),
  active: z.boolean().optional().default(true),
});

function requireMongo() {
  return hasConfiguredMongoUri();
}

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  if (!requireMongo()) return NextResponse.json({ reels: [] }, { headers: NO_STORE });
  await connectDB();
  const reels = await Reel.find({}).sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ reels }, { headers: NO_STORE });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = reelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid reel" }, { status: 400, headers: NO_STORE });
  }
  if (!requireMongo()) {
    return NextResponse.json({ error: "Reels storage not configured" }, { status: 503, headers: NO_STORE });
  }
  await connectDB();
  const id = `reel-${Date.now()}-${randomUUID().slice(0, 6)}`;
  const reel = await Reel.create({ _id: id, ...parsed.data });
  await logAdminAction({ action: "admin.reel.create", actorId: auth.userId, actorEmail: auth.email, targetType: "reel", targetId: id, ip: getClientIpFromHeaders(req.headers) });
  return NextResponse.json({ success: true, reel }, { status: 201, headers: NO_STORE });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const id = new URL(req.url).searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400, headers: NO_STORE });
  if (!requireMongo()) {
    return NextResponse.json({ error: "Reels storage not configured" }, { status: 503, headers: NO_STORE });
  }
  await connectDB();
  await Reel.deleteOne({ _id: id });
  await logAdminAction({ action: "admin.reel.delete", actorId: auth.userId, actorEmail: auth.email, targetType: "reel", targetId: id, ip: getClientIpFromHeaders(req.headers) });
  return NextResponse.json({ success: true }, { headers: NO_STORE });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, requireAdminWrite } from "@/lib/adminRoles";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import ReturnRequest from "@/models/Return";
import { parsePaginationParams } from "@/lib/pagination";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["approved", "rejected", "completed"]),
  adminNote: z.string().max(1000).optional().default(""),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if ("response" in gate) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ returns: [], pagination: { page: 1, limit: 24, total: 0, totalPages: 1 } }, { headers: NO_STORE });
  }
  try {
    await connectDB();
    const url = new URL(req.url);
    const status = String(url.searchParams.get("status") ?? "").trim();
    const filter = status ? { status } : {};
    const { page, limit } = parsePaginationParams(url);
    const total = await ReturnRequest.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const rows = await ReturnRequest.find(filter).sort({ createdAt: -1 }).skip((safePage - 1) * limit).limit(limit).lean();
    return NextResponse.json({ returns: rows, pagination: { page: safePage, limit, total, totalPages } }, { headers: NO_STORE });
  } catch (error) {
    console.error("Admin returns GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500, headers: NO_STORE });
  }
}

export async function PATCH(req: NextRequest) {
  const gate = await requireAdminWrite(req, "returns");
  if ("response" in gate) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  const auth = gate.auth;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Returns storage not configured" }, { status: 503, headers: NO_STORE });
  }
  try {
    await connectDB();
    const updated = await ReturnRequest.findOneAndUpdate(
      { _id: parsed.data.id },
      { $set: { status: parsed.data.status, adminNote: parsed.data.adminNote, updatedAt: new Date() } },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: "Return not found" }, { status: 404, headers: NO_STORE });
    }
    await logAdminAction({
      action: "admin.return.status",
      actorId: auth.userId,
      actorEmail: auth.email,
      targetType: "return",
      targetId: parsed.data.id,
      detail: { status: parsed.data.status },
      ip: getClientIpFromHeaders(req.headers),
    });
    return NextResponse.json({ success: true, return: updated }, { headers: NO_STORE });
  } catch (error) {
    console.error("Admin returns PATCH error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to update return" }, { status: 500, headers: NO_STORE });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import AdminAudit from "@/models/AdminAudit";
import { parsePaginationParams } from "@/lib/pagination";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ logs: [], pagination: { page: 1, limit: 24, total: 0, totalPages: 1 } }, { headers: NO_STORE });
  }
  try {
    await connectDB();
    const url = new URL(req.url);
    const action = String(url.searchParams.get("action") ?? "").trim();
    const filter = action ? { action } : {};
    const { page, limit } = parsePaginationParams(url);
    const total = await AdminAudit.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const logs = await AdminAudit.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .lean();
    return NextResponse.json(
      {
        logs: logs.map((l: { action?: string; actorEmail?: string; targetType?: string; targetId?: string; createdAt?: Date; detail?: unknown }) => ({
          action: l.action,
          actorEmail: l.actorEmail,
          targetType: l.targetType,
          targetId: l.targetId,
          createdAt: l.createdAt,
          detail: l.detail,
        })),
        pagination: { page: safePage, limit, total, totalPages },
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("Admin audit GET error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500, headers: NO_STORE });
  }
}

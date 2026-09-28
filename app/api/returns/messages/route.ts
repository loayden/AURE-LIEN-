import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrCreateUserId } from "@/lib/userSession";
import { logAdminAction, getClientIpFromHeaders } from "@/lib/adminAudit";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import ReturnRequest from "@/models/Return";
import ReturnMessage from "@/models/ReturnMessage";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

async function canAccess(returnId: string, userId: string, role?: string): Promise<boolean> {
  if (role === "admin") return true;
  await connectDB();
  const row = await ReturnRequest.findOne({ _id: returnId, userId }).lean();
  return Boolean(row);
}

/** GET ?returnId= — thread (owner or admin). POST { returnId, body } — reply. */
export async function GET(req: NextRequest) {
  const returnId = String(new URL(req.url).searchParams.get("returnId") ?? "").trim();
  if (!returnId) return NextResponse.json({ error: "returnId required" }, { status: 400, headers: NO_STORE });
  if (!hasConfiguredMongoUri()) return NextResponse.json({ messages: [] }, { headers: NO_STORE });
  const auth = await getAuthFromRequest(req);
  const { userId } = auth?.userId ? { userId: auth.userId } : await getOrCreateUserId(req);
  try {
    if (!(await canAccess(returnId, userId, auth?.role))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403, headers: NO_STORE });
    }
    const messages = await ReturnMessage.find({ returnId }).sort({ createdAt: 1 }).limit(200).lean();
    return NextResponse.json({ messages }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ messages: [] }, { headers: NO_STORE });
  }
}

const postSchema = z.object({
  returnId: z.string().min(1),
  body: z.string().min(1, "Message required").max(2000),
});

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers: NO_STORE });
  }
  if (!hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Messaging not configured" }, { status: 503, headers: NO_STORE });
  }
  const auth = await getAuthFromRequest(req);
  const { userId } = auth?.userId ? { userId: auth.userId } : await getOrCreateUserId(req);
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400, headers: NO_STORE });
  }
  try {
    await connectDB();
    if (!(await canAccess(parsed.data.returnId, userId, auth?.role))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403, headers: NO_STORE });
    }
    const message = await ReturnMessage.create({
      returnId: parsed.data.returnId,
      authorRole: auth?.role === "admin" ? "admin" : "customer",
      authorId: userId,
      body: parsed.data.body.slice(0, 2000),
    });
    if (auth?.role === "admin") {
      await logAdminAction({
        action: "admin.return.message",
        actorId: auth.userId,
        actorEmail: auth.email,
        targetType: "return",
        targetId: parsed.data.returnId,
        ip: getClientIpFromHeaders(req.headers),
      });
    }
    return NextResponse.json({ success: true, message }, { status: 201, headers: NO_STORE });
  } catch (error) {
    console.error("Return message error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to send message" }, { status: 500, headers: NO_STORE });
  }
}

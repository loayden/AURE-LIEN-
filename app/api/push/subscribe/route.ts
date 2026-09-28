import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthFromRequest } from "@/lib/auth";
import { getOrCreateUserId } from "@/lib/userSession";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import PushSubscription from "@/models/PushSubscription";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const subscribeSchema = z.object({
  endpoint: z.string().url().max(2000),
  keys: z.object({ p256dh: z.string().min(1).max(500), auth: z.string().min(1).max(500) }),
});

/** POST: save a push subscription. DELETE: remove (?endpoint=). */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  const auth = await getAuthFromRequest(req);
  const { userId } = auth?.userId ? { userId: auth.userId } : await getOrCreateUserId(req);
  const body = await req.json().catch(() => ({}));
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400, headers: NO_STORE });
  }
  if (!process.env.VAPID_PUBLIC_KEY || !hasConfiguredMongoUri()) {
    return NextResponse.json({ error: "Push notifications are not configured" }, { status: 503, headers: NO_STORE });
  }
  try {
    await connectDB();
    await PushSubscription.findOneAndUpdate(
      { endpoint: parsed.data.endpoint },
      { userId, endpoint: parsed.data.endpoint, p256dh: parsed.data.keys.p256dh, auth: parsed.data.keys.auth },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500, headers: NO_STORE });
  }
}

export async function DELETE(req: NextRequest) {
  const endpoint = String(new URL(req.url).searchParams.get("endpoint") ?? "");
  if (!endpoint || !hasConfiguredMongoUri()) {
    return NextResponse.json({ success: true }, { headers: NO_STORE });
  }
  try {
    await connectDB();
    await PushSubscription.deleteOne({ endpoint });
  } catch {
    // ignore
  }
  return NextResponse.json({ success: true }, { headers: NO_STORE });
}

import { NextRequest, NextResponse } from "next/server";
import { getOrdersJson } from "@/lib/orderStorage";
import { getDraftsJson } from "@/lib/redisStorage";
import { sendEmailAsync } from "@/lib/email/sender";
import { getAbandonedCartEmailHtml } from "@/lib/email/templates/abandoned";
import { getPublicBaseUrl } from "@/lib/baseUrl";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const REMIND_AFTER_MS = 24 * 60 * 60 * 1000;
const EXPIRE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_SENDS = 50;

function authorized(req: NextRequest): boolean {
  const secret = String(process.env.CRON_SECRET ?? "").trim();
  if (!secret) return false;
  const header = String(req.headers.get("authorization") ?? "").trim();
  return header === `Bearer ${secret}`;
}

async function getReminderMarker(userId: string): Promise<string> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (!url || !token) return "";
    const res = await fetch(`${url}/get/${encodeURIComponent(`aurelien:cart-reminded:${userId}`)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return "";
    const json = (await res.json().catch(() => ({}))) as { result?: unknown };
    return String(json.result ?? "");
  } catch {
    return "";
  }
}

async function setReminderMarker(userId: string, draftUpdatedAt: string): Promise<void> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (!url || !token) return;
    const key = encodeURIComponent(`aurelien:cart-reminded:${userId}`);
    await fetch(`${url}/set/${key}/${encodeURIComponent(draftUpdatedAt)}/ex/604800`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  } catch {
    // best effort
  }
}

/**
 * Abandoned checkout reminders. Called by Vercel Cron with
 * `Authorization: Bearer $CRON_SECRET`. `?dryRun=1` previews without sending.
 */
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503, headers: NO_STORE });
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";
  const now = Date.now();
  const drafts = await getDraftsJson().catch(() => ({} as Record<string, unknown>));
  const orders = await getOrdersJson().catch(() => []);
  const candidates: Array<{ userId: string; email: string; items: Array<{ name: string; price: number; quantity: number }> }> = [];

  for (const [userId, raw] of Object.entries(drafts)) {
    const draft = raw as { items?: unknown[]; form?: Record<string, unknown>; updatedAt?: string };
    const updatedAt = new Date(String(draft.updatedAt ?? "")).getTime();
    if (!Number.isFinite(updatedAt)) continue;
    const age = now - updatedAt;
    if (age < REMIND_AFTER_MS || age > EXPIRE_AFTER_MS) continue;
    const items = Array.isArray(draft.items) ? draft.items : [];
    if (items.length === 0) continue;
    const email = String(draft.form?.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
    const orderedAfter = orders.some(
      (o) => o.userId === userId && new Date(o.createdAt ?? 0).getTime() > updatedAt
    );
    if (orderedAfter) continue;
    const remindedAt = await getReminderMarker(userId);
    if (remindedAt && remindedAt >= String(draft.updatedAt)) continue;
    candidates.push({
      userId,
      email,
      items: items.slice(0, 6).map((item) => {
        const row = item as Record<string, unknown>;
        return {
          name: String(row.name ?? "BOUT item"),
          price: Number(row.price ?? 0),
          quantity: Number(row.quantity ?? 1),
        };
      }),
    });
    if (candidates.length >= MAX_SENDS) break;
  }

  if (!dryRun) {
    const baseUrl = getPublicBaseUrl(req);
    for (const candidate of candidates) {
      sendEmailAsync({
        to: candidate.email,
        subject: "Your BOUT bag is waiting",
        html: getAbandonedCartEmailHtml({
          customerName: candidate.email.split("@")[0],
          items: candidate.items,
          resumeUrl: baseUrl ? `${baseUrl}/checkout` : "/checkout",
        }),
      });
      await setReminderMarker(candidate.userId, String((drafts[candidate.userId] as { updatedAt?: string })?.updatedAt ?? ""));
    }
  }

  return NextResponse.json({ dryRun, reminded: candidates.length }, { headers: NO_STORE });
}

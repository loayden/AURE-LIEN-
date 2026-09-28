import { NextRequest, NextResponse } from "next/server";
import { getOrdersJson } from "@/lib/orderStorage";
import { getUsersJson } from "@/lib/usersJson";
import { sendEmailAsync } from "@/lib/email/sender";
import { getBirthdayEmailHtml, getWinbackEmailHtml } from "@/lib/email/templates/abandoned";
import { grantBonus } from "@/lib/loyaltyLedger";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_SENDS = 50;

function authorized(req: NextRequest): boolean {
  const secret = String(process.env.CRON_SECRET ?? "").trim();
  if (!secret) return false;
  return String(req.headers.get("authorization") ?? "").trim() === `Bearer ${secret}`;
}

async function alreadyReminded(key: string): Promise<boolean> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (!url || !token) return false;
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const json = (await res.json().catch(() => ({}))) as { result?: unknown };
    return json.result != null;
  } catch {
    return false;
  }
}

async function markReminded(key: string, ttlSec = 15552000): Promise<void> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (!url || !token) return;
    await fetch(`${url}/set/${encodeURIComponent(key)}/1/ex/${ttlSec}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  } catch {
    // best effort
  }
}

/**
 * Win-back (inactive 60–180d) + birthday (today + 100pt gift) emails.
 * CRON_SECRET-guarded; dryRun=1 previews. Sends are deduped via markers.
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
  const today = new Date(now);
  const todayKey = `${today.getMonth()}-${today.getDate()}`;

  const [orders, users] = await Promise.all([
    getOrdersJson().catch(() => []),
    getUsersJson().catch(() => []),
  ]);
  const lastOrderByUser = new Map<string, number>();
  const idByEmail = new Map<string, string>();
  for (const o of orders) {
    const t = new Date(o.createdAt ?? 0).getTime();
    if (!Number.isFinite(t)) continue;
    const key = String(o.userId ?? "");
    if (key && (!lastOrderByUser.has(key) || t > (lastOrderByUser.get(key) ?? 0))) {
      lastOrderByUser.set(key, t);
    }
    const email = String(o.customer?.email ?? "").trim().toLowerCase();
    if (email && key && !idByEmail.has(email)) idByEmail.set(email, key);
  }

  let winback = 0;
  let birthdays = 0;
  for (const user of users) {
    if (winback + birthdays >= MAX_SENDS) break;
    const email = String(user.email ?? "").trim().toLowerCase();
    if (!email || user.role === "admin") continue;
    const name = String(user.name ?? "").trim() || email.split("@")[0];
    const userId = user.id || idByEmail.get(email) || "";

    // Birthday today → gift + email (once per year via marker).
    const birth = String(user.birthdate ?? "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
      const [, m, d] = birth.split("-").map(Number);
      if (`${m - 1}-${d}` === todayKey) {
        const marker = `aurelien:winback:bday:${userId || email}:${today.getFullYear()}`;
        if (!(await alreadyReminded(marker))) {
          if (!dryRun) {
            await grantBonus(userId || email, 100, "Birthday gift");
            sendEmailAsync({ to: email, subject: "Happy birthday from BOUT", html: getBirthdayEmailHtml({ customerName: name }) });
            await markReminded(marker);
          }
          birthdays++;
          continue;
        }
      }
    }

    // Win-back: last order 60–180 days ago.
    const last = userId ? lastOrderByUser.get(userId) : undefined;
    if (last !== undefined) {
      const age = now - last;
      if (age >= 60 * DAY_MS && age <= 180 * DAY_MS) {
        const marker = `aurelien:winback:inactive:${userId || email}`;
        if (!(await alreadyReminded(marker))) {
          if (!dryRun) {
            sendEmailAsync({ to: email, subject: "We miss you — new arrivals at BOUT", html: getWinbackEmailHtml({ customerName: name }) });
            await markReminded(marker);
          }
          winback++;
        }
      }
    }
  }

  return NextResponse.json({ dryRun, winback, birthdays }, { headers: NO_STORE });
}

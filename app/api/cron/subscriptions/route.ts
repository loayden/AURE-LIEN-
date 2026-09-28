import { NextRequest, NextResponse } from "next/server";
import {
  getBoutiqueApplications,
  getBoutiquePartnerAccess,
  SUBSCRIPTION_GRACE_DAYS,
} from "@/lib/boutiqueApplications";
import { sendEmailAsync } from "@/lib/email/sender";
import { getSubscriptionEmailHtml } from "@/lib/email/templates/transactional";
import { getPublicBaseUrl } from "@/lib/baseUrl";

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

async function markReminded(key: string): Promise<void> {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
    if (!url || !token) return;
    await fetch(`${url}/set/${encodeURIComponent(key)}/1/ex/2592000`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  } catch {
    // best effort
  }
}

/**
 * Subscription lifecycle reminders (trial ending, renewal due, lapsed).
 * CRON_SECRET-guarded; dryRun=1 previews. Read-only except reminder markers.
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
  const baseUrl = getPublicBaseUrl(req);
  const applications = await getBoutiqueApplications().catch(() => []);
  const queued: Array<{ to: string; subject: string; html: string; marker: string }> = [];

  for (const app of applications) {
    if (app.status !== "approved" && app.status !== "pending") continue;
    const access = getBoutiquePartnerAccess(app, new Date(now));
    const email = String(app.email ?? "").trim();
    if (!email || queued.length >= MAX_SENDS) continue;
    const actionUrl = baseUrl
      ? `${baseUrl}/partners/subscription?applicationId=${encodeURIComponent(app._id)}`
      : `/partners/subscription?applicationId=${encodeURIComponent(app._id)}`;

    // Trial ending within 2 days (trial flow, not yet subscribed).
    if (app.trialDays > 0 && app.subscriptionStatus !== "subscribed" && access.reason === "trial_active" && access.daysRemaining <= 2) {
      const marker = `aurelien:sub-reminded:${app._id}:trial-ending`;
      if (!(await alreadyReminded(marker))) {
        queued.push({
          to: email,
          subject: `BOUT trial ending · ${app.boutiqueName}`,
          html: getSubscriptionEmailHtml({ ownerName: app.ownerName, boutiqueName: app.boutiqueName, kind: "trial_ending", planName: app.planName, detail: `${access.daysRemaining} day(s) left`, actionUrl }),
          marker,
        });
      }
      continue;
    }

    // Paid renewal due within 3 days.
    if (app.subscriptionStatus === "subscribed" && app.paidUntil) {
      const msLeft = new Date(app.paidUntil).getTime() - now;
      if (msLeft > 0 && msLeft <= 3 * DAY_MS) {
        const marker = `aurelien:sub-reminded:${app._id}:renewal-${String(app.paidUntil).slice(0, 10)}`;
        if (!(await alreadyReminded(marker))) {
          queued.push({
            to: email,
            subject: `BOUT renewal due · ${app.boutiqueName}`,
            html: getSubscriptionEmailHtml({ ownerName: app.ownerName, boutiqueName: app.boutiqueName, kind: "renewal_due", planName: app.planName, detail: `Renews ${new Date(app.paidUntil).toLocaleDateString()}`, actionUrl }),
            marker,
          });
        }
        continue;
      }
      // Lapsed beyond grace.
      if (msLeft < -SUBSCRIPTION_GRACE_DAYS * DAY_MS) {
        const marker = `aurelien:sub-reminded:${app._id}:lapsed`;
        if (!(await alreadyReminded(marker))) {
          queued.push({
            to: email,
            subject: `BOUT subscription lapsed · ${app.boutiqueName}`,
            html: getSubscriptionEmailHtml({ ownerName: app.ownerName, boutiqueName: app.boutiqueName, kind: "lapsed", planName: app.planName, actionUrl }),
            marker,
          });
        }
      }
    }
  }

  if (!dryRun) {
    for (const item of queued) {
      sendEmailAsync({ to: item.to, subject: item.subject, html: item.html });
      await markReminded(item.marker);
    }
  }
  return NextResponse.json({ dryRun, queued: queued.length }, { headers: NO_STORE });
}

import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/getAllProducts";
import { sendEmailAsync } from "@/lib/email/sender";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function authorized(req: NextRequest): boolean {
  const secret = String(process.env.CRON_SECRET ?? "").trim();
  if (!secret) return false;
  return String(req.headers.get("authorization") ?? "").trim() === `Bearer ${secret}`;
}

/**
 * Low-stock digest to admins. CRON_SECRET-guarded; dryRun=1 previews.
 * Threshold via ?threshold= (default 5).
 */
export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503, headers: NO_STORE });
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";
  const threshold = Math.max(1, Math.min(100, Number(new URL(req.url).searchParams.get("threshold") ?? 5) || 5));
  const products = await getAllProducts().catch(() => []);
  const low = products
    .filter((p) => typeof p.stock === "number" && p.stock <= threshold)
    .map((p) => ({ id: p._id, name: p.name, stock: p.stock ?? 0, price: p.price }))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 100);

  if (!dryRun && low.length > 0) {
    const to = String(process.env.ADMIN_EMAIL ?? "").trim();
    if (to) {
      const rows = low.map((p) => `<tr><td style="padding:8px;color:#F5F1E9;">${p.name}</td><td style="padding:8px;color:#C6A75E;text-align:right;">${p.stock}</td></tr>`).join("");
      sendEmailAsync({
        to,
        subject: `BOUT low stock · ${low.length} products at or below ${threshold}`,
        html: `<p>Low-stock digest (threshold ${threshold}):</p><table>${rows}</table><p>Restock from Admin → Products.</p>`,
      });
    }
  }
  return NextResponse.json({ dryRun, threshold, lowCount: low.length, low: dryRun ? low.slice(0, 20) : [] }, { headers: NO_STORE });
}

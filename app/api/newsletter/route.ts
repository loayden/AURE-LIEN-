import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Newsletter from "@/models/Newsletter";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readLocalSubscribers(filePath: string) {
  try {
    const text = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.cart);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 200);
    const source = String(body?.source ?? "storefront").trim().slice(0, 40) || "storefront";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    // Mongo primary (works on Vercel); local JSON dev-only fallback.
    if (hasConfiguredMongoUri()) {
      try {
        await connectDB();
        const existing = await Newsletter.findOne({ email }).lean();
        if (!existing) {
          await Newsletter.create({ email, source });
        }
        return NextResponse.json({
          ok: true,
          message: existing ? "You are already on the list." : "You are on the list.",
        });
      } catch (error) {
        console.error("Newsletter Mongo error:", error instanceof Error ? error.message : "unknown");
        return NextResponse.json({ error: "Unable to save your email right now." }, { status: 500 });
      }
    }

    const filePath = path.join(process.cwd(), "data", "newsletter.json");
    const subscribers = await readLocalSubscribers(filePath);
    const existing = subscribers.find((item: unknown) => {
      const row = item as Record<string, unknown>;
      return String(row.email ?? "").toLowerCase() === email;
    });

    if (!existing) {
      subscribers.push({
        email,
        source,
        createdAt: new Date().toISOString(),
      });
      await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), "utf-8");
    }

    return NextResponse.json({
      ok: true,
      message: existing ? "You are already on the list." : "You are on the list.",
    });
  } catch (error) {
    console.error("Newsletter signup error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Unable to save your email right now." }, { status: 500 });
  }
}

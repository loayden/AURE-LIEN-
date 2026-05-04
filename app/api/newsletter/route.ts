import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readSubscribers(filePath: string) {
  try {
    const text = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const source = String(body?.source ?? "storefront").trim().slice(0, 40) || "storefront";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "newsletter.json");
    const subscribers = await readSubscribers(filePath);
    const existing = subscribers.find((item: any) => String(item.email).toLowerCase() === email);

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
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Unable to save your email right now." }, { status: 500 });
  }
}

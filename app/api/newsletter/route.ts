import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { paths } from "@/lib/dataPaths";

type NewsletterSubscription = {
  email: string;
  createdAt: string;
};

const BLOB_NEWSLETTER_PATH = "newsletter.json";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasCloudStorage(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

async function readBlobByPathname(pathname: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const { list } = await import("@vercel/blob");
  const result = await list({ prefix: pathname.replace(/\.[^/.]+$/, "") });
  const blob = result.blobs.find((item) => item.pathname === pathname);
  if (!blob) return null;

  const res = await fetch(blob.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.text();
}

async function readSubscriptions(): Promise<NewsletterSubscription[]> {
  if (hasCloudStorage()) {
    const text = await readBlobByPathname(BLOB_NEWSLETTER_PATH);
    if (!text) return [];
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  }

  try {
    const text = await fs.readFile(paths.newsletter, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSubscriptions(subscriptions: NewsletterSubscription[]): Promise<void> {
  const deduped = Array.from(
    new Map(subscriptions.map((subscription) => [subscription.email, subscription])).values()
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (hasCloudStorage()) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_NEWSLETTER_PATH, JSON.stringify(deduped, null, 2), {
      access: "public",
      contentType: "application/json",
    });
    return;
  }

  await fs.writeFile(paths.newsletter, JSON.stringify(deduped, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const subscriptions = await readSubscriptions();
    const existing = subscriptions.find((subscription) => subscription.email === email);

    if (existing) {
      return NextResponse.json({ subscribed: true, duplicate: true });
    }

    await writeSubscriptions([
      ...subscriptions,
      {
        email,
        createdAt: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ subscribed: true });
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}

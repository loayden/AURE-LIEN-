import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { paths } from "@/lib/dataPaths";
import { attachUserCookie } from "@/lib/userSession";

type DraftRecord = {
  items: Array<{ _id: string; productId?: string; name: string; price: number; quantity: number; image?: string }>;
  form: Record<string, unknown>;
  updatedAt: string;
};

type DraftsFile = Record<string, DraftRecord>;

async function ensureDataDir() {
  const dir = path.dirname(paths.checkoutDrafts);
  await fs.mkdir(dir, { recursive: true });
}

async function readDrafts(): Promise<DraftsFile> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(paths.checkoutDrafts, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeDrafts(drafts: DraftsFile) {
  await ensureDataDir();
  await fs.writeFile(paths.checkoutDrafts, JSON.stringify(drafts, null, 2));
}

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

/** GET: fetch checkout draft for current user */
export async function GET(req: NextRequest) {
  try {
    const { userId, isNew } = await resolveUserId(req);
    const drafts = await readDrafts();
    const draft = drafts[userId] || null;
    const res = NextResponse.json({ draft }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (e) {
    console.error("Checkout draft GET error:", e);
    return NextResponse.json({ draft: null }, { status: 500 });
  }
}

/** POST: save checkout draft for current user */
export async function POST(req: NextRequest) {
  try {
    const { userId, isNew } = await resolveUserId(req);
    const body = await req.json();
    const { items = [], form = {} } = body;

    const drafts = await readDrafts();
    drafts[userId] = {
      items: Array.isArray(items) ? items : [],
      form: form && typeof form === "object" ? form : {},
      updatedAt: new Date().toISOString(),
    };
    await writeDrafts(drafts);

    const res = NextResponse.json({ success: true }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (e) {
    console.error("Checkout draft POST error:", e);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}

/** DELETE: clear checkout draft for current user */
export async function DELETE(req: NextRequest) {
  try {
    const { userId, isNew } = await resolveUserId(req);
    const drafts = await readDrafts();
    delete drafts[userId];
    await writeDrafts(drafts);

    const res = NextResponse.json({ success: true }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (e) {
    console.error("Checkout draft DELETE error:", e);
    return NextResponse.json({ error: "Failed to clear draft" }, { status: 500 });
  }
}

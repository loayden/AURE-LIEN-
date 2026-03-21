import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserId } from "@/lib/userSession";
import { getAuthFromRequest } from "@/lib/auth";
import { getDraftsJson, setDraftsJson } from "@/lib/draftStorage";
import { attachUserCookie } from "@/lib/userSession";

type DraftRecord = {
  items: Array<{ _id: string; productId?: string; name: string; price: number; quantity: number; image?: string }>;
  form: Record<string, unknown>;
  updatedAt: string;
};

type DraftsFile = Record<string, DraftRecord>;

async function resolveUserId(req: NextRequest): Promise<{ userId: string; isNew: boolean }> {
  const auth = await getAuthFromRequest(req);
  if (auth?.userId) return { userId: auth.userId, isNew: false };
  return getOrCreateUserId(req);
}

/** GET: fetch checkout draft for current user */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, isNew } = await resolveUserId(req);
    
    let drafts: DraftsFile = {};
    try {
      drafts = await getDraftsJson();
    } catch (storageError) {
      console.warn("Failed to read drafts:", storageError);
      drafts = {};
    }
    
    const draft = drafts[userId] || null;
    const res = NextResponse.json({ draft }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (e) {
    console.error("❌ Checkout draft GET error:", e instanceof Error ? e.message : String(e));
    return NextResponse.json({ draft: null, error: "Failed to fetch draft" }, { status: 500 });
  }
}

/** POST: save checkout draft for current user */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, isNew } = await resolveUserId(req);
    
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ Invalid JSON in checkout draft POST:", parseError);
      return NextResponse.json(
        { error: "Invalid request body - must be valid JSON" },
        { status: 400 }
      );
    }

    const { items = [], form = {} } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    if (typeof form !== "object" || form === null) {
      return NextResponse.json(
        { error: "Form must be an object" },
        { status: 400 }
      );
    }

    let drafts: DraftsFile = {};
    try {
      drafts = await getDraftsJson();
    } catch (storageError) {
      console.warn("Failed to read existing drafts:", storageError);
      drafts = {};
    }

    drafts[userId] = {
      items: items,
      form: form,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDraftsJson(drafts);
    } catch (writeError) {
      console.error("❌ Failed to write drafts to storage:", writeError instanceof Error ? writeError.message : String(writeError));
      return NextResponse.json(
        { error: "Failed to save draft to storage" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ success: true, userId }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (e) {
    console.error("❌ Checkout draft POST error:", e instanceof Error ? e.message : String(e));
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}

/** DELETE: clear checkout draft for current user */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, isNew } = await resolveUserId(req);
    
    let drafts: DraftsFile = {};
    try {
      drafts = await getDraftsJson();
    } catch (storageError) {
      console.warn("Failed to read drafts for deletion:", storageError);
      const res = NextResponse.json({ success: true }, { status: 200 });
      if (isNew) attachUserCookie(res, userId);
      return res;
    }

    delete drafts[userId];

    try {
      await setDraftsJson(drafts);
    } catch (writeError) {
      console.error("❌ Failed to delete draft:", writeError instanceof Error ? writeError.message : String(writeError));
      return NextResponse.json(
        { error: "Failed to delete draft" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ success: true }, { status: 200 });
    if (isNew) attachUserCookie(res, userId);
    return res;
  } catch (e) {
    console.error("❌ Checkout draft DELETE error:", e instanceof Error ? e.message : String(e));
    return NextResponse.json(
      { error: "Failed to clear draft" },
      { status: 500 }
    );
  }
}
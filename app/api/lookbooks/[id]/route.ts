import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Lookbook from "@/models/Lookbook";
import { getFallbackLookbookById } from "@/lib/lookbooksData";
import { getAuthFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const lookbook = await Lookbook.findById(id).lean() as unknown as Record<string, unknown> | null;
    if (!lookbook) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (lookbook.published !== true) {
      const auth = await getAuthFromRequest(req).catch(() => null);
      if (!auth || (auth.role !== "admin" && auth.role !== "support")) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }
    return NextResponse.json(lookbook);
  } catch {
    const lookbook = getFallbackLookbookById(id);
    if (!lookbook) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(lookbook);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const allowed: Record<string, unknown> = {};
    for (const key of ["title", "slug", "sections", "published", "coverImage", "description"]) {
      if (body[key] !== undefined) allowed[key] = body[key];
    }
    if (typeof allowed.title === "string" && !allowed.title.trim()) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }
    if (typeof allowed.slug === "string") {
      allowed.slug = String(allowed.slug).toLowerCase().replace(/\s+/g, "-").slice(0, 120);
    }
    const lookbook = await Lookbook.findByIdAndUpdate(
      id,
      { ...allowed, updatedAt: new Date() },
      { new: true }
    );
    if (!lookbook) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lookbook);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    await Lookbook.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

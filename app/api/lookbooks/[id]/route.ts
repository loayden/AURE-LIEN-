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
    const lookbook = await Lookbook.findById(id).lean();
    if (!lookbook) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    const lookbook = await Lookbook.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
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

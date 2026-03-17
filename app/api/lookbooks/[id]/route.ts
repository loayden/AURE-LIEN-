import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Lookbook from "@/models/Lookbook";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const lookbook = await Lookbook.findById(id).lean();
    if (!lookbook) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lookbook);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Lookbook.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

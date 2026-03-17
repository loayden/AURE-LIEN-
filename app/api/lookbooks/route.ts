import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Lookbook from "@/models/Lookbook";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const published = req.nextUrl.searchParams.get("published");
    const q = published === "true" ? { published: true } : {};
    const lookbooks = await Lookbook.find(q).sort({ createdAt: -1 }).lean();
    return NextResponse.json(lookbooks);
  } catch (e) {
    console.error("Lookbooks GET:", e);
    return NextResponse.json({ error: "Failed to fetch lookbooks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, slug, sections } = body;
    if (!title || !slug) {
      return NextResponse.json({ error: "title and slug required" }, { status: 400 });
    }
    const lookbook = await Lookbook.create({
      title,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      sections: sections || [],
      published: false,
    });
    return NextResponse.json(lookbook);
  } catch (e) {
    console.error("Lookbooks POST:", e);
    return NextResponse.json({ error: "Failed to create lookbook" }, { status: 500 });
  }
}

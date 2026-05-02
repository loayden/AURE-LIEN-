import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Lookbook from "@/models/Lookbook";
import { fallbackLookbooks } from "@/lib/lookbooksData";
import { requireAdminRequest } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const published = req.nextUrl.searchParams.get("published");
  const q = published === "true" ? { published: true } : {};

  try {
    await connectDB();
    const lookbooks = await Lookbook.find(q).sort({ createdAt: -1 }).lean();
    return NextResponse.json(lookbooks);
  } catch (e) {
    console.error("Lookbooks GET:", e);
    const filtered = fallbackLookbooks.filter((lookbook) =>
      q.published ? lookbook.published : true
    );
    return NextResponse.json(filtered);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminRequest(req);
  if (unauthorized) return unauthorized;

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

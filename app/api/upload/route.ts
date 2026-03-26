import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/gif", "gif"],
]);

function sanitizeBaseName(filename: string) {
  const baseName = filename.replace(/\.[^.]+$/, "").toLowerCase();
  return baseName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, WebP, AVIF, or GIF." },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Keep uploads under 8 MB." },
        { status: 413 }
      );
    }

    const extension = ALLOWED_TYPES.get(file.type) ?? "bin";
    const safeBaseName = sanitizeBaseName(file.name) || "upload";
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeBaseName}.${extension}`;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const outputPath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    const bytes = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(outputPath, bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Unable to store the uploaded image." }, { status: 500 });
  }
}

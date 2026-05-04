import { randomUUID } from "crypto";
import { getAuthFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";
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

async function saveLocally(file: File, filename: string) {
  const [{ mkdir, writeFile }, { join }] = await Promise.all([import("fs/promises"), import("path")]);

  const uploadDir = join(process.cwd(), "public", "uploads");
  const outputPath = join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(outputPath, bytes);

  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

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
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Keep the local filesystem fallback out of production bundles.
    // Otherwise Next/Vercel output tracing pulls the entire public/uploads
    // directory into this function, which blows past the serverless size limit.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Upload storage is not configured. Set BLOB_READ_WRITE_TOKEN for production." },
        { status: 500 }
      );
    }

    const localUrl = await saveLocally(file, filename);
    return NextResponse.json({ url: localUrl });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Unable to store the uploaded image." }, { status: 500 });
  }
}

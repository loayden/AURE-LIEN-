import { randomUUID } from "crypto";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { hasVercelBlobStorage } from "@/lib/blobStorage";
import { getBoutiqueApplications } from "@/lib/boutiqueApplications";
import { RATE_LIMITS, rateLimitResponse } from "@/lib/rateLimit";
import { isOriginAllowed } from "@/lib/csrf";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_FILES_PER_DRAFT = 8;
const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function sanitizeBaseName(filename: string) {
  const baseName = filename.replace(/\.[^.]+$/, "").toLowerCase();
  return baseName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/**
 * Guest-safe boutique proof-photo upload. No auth (applicants have no account
 * yet); abuse contained by rate limits, image-only types, 8MB cap, random
 * names, and uploads that are invisible until admin verification.
 */
export async function POST(req: NextRequest) {
  const limited = await rateLimitResponse(req, RATE_LIMITS.upload);
  if (limited) return limited;
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  try {
    const formData = await req.formData();
    const draftId = cleanString(formData.get("draftId")).slice(0, 120);
    if (!draftId) {
      return NextResponse.json({ error: "draftId is required" }, { status: 400 });
    }
    // Uploads attach to a real draft only — blocks anonymous storage abuse.
    const applications = await getBoutiqueApplications().catch(() => []);
    const draftExists = applications.some((a) => a._id === draftId);
    if (!draftExists) {
      return NextResponse.json({ error: "Unknown draft. Save the form first." }, { status: 404 });
    }
    const files = formData.getAll("photos").filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: "At least one photo is required" }, { status: 400 });
    }
    if (files.length > MAX_FILES_PER_DRAFT) {
      return NextResponse.json({ error: `Max ${MAX_FILES_PER_DRAFT} photos` }, { status: 400 });
    }
    const urls: string[] = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({ error: "Photos must be JPG, PNG, WebP, or AVIF" }, { status: 415 });
      }
      if (file.size > MAX_FILE_BYTES || file.size === 0) {
        return NextResponse.json({ error: "Each photo must be under 8 MB" }, { status: 413 });
      }
      const ext = ALLOWED_TYPES.get(file.type) as string;
      const filename = `proof-${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeBaseName(file.name) || "shop"}.${ext}`;
      const bytes = new Uint8Array(await file.arrayBuffer());

      if (hasVercelBlobStorage()) {
        const { put } = await import("@vercel/blob");
        const blob = await put(`boutique-proof/${filename}`, new Blob([bytes], { type: file.type }), {
          access: "public",
          contentType: file.type,
        });
        urls.push(blob.url);
      } else {
        const uploadDir = join(process.cwd(), "public", "uploads", "boutique-proof");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), bytes);
        urls.push(`/uploads/boutique-proof/${filename}`);
      }
    }
    return NextResponse.json(
      { success: true, urls },
      { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Boutique proof upload error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

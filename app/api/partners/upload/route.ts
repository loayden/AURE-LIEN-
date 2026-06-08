import { randomUUID } from "crypto";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { hasVercelBlobStorage, isHostedVercelRuntime } from "@/lib/blobStorage";
import { getBoutiqueApplications, getBoutiquePartnerAccess } from "@/lib/boutiqueApplications";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
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
    .slice(0, 60);
}

async function saveLocally(file: File, filename: string) {
  const uploadDir = join(process.cwd(), "public", "uploads", "partners");
  const outputPath = join(uploadDir, filename);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(outputPath, new Uint8Array(await file.arrayBuffer()));
  return `/uploads/partners/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Sign in with the partner account before uploading product images." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const applicationId = cleanString(formData.get("applicationId"));
    const file = formData.get("file");

    if (!applicationId) {
      return NextResponse.json({ error: "Application id is required." }, { status: 400 });
    }

    const application = (await getBoutiqueApplications()).find((item) => item._id === applicationId);
    if (!application) {
      return NextResponse.json(
        {
          code: "application_not_found",
          error: "We could not find this boutique application. Choose your boutique from the partner desk, or submit the partnership request first.",
        },
        { status: 404 }
      );
    }

    const ownsApplication =
      application.partnerUserId === auth.userId ||
      (!application.partnerUserId && application.email && application.email.toLowerCase() === auth.email?.toLowerCase()) ||
      auth.role === "admin";

    if (!ownsApplication) {
      return NextResponse.json({ error: "Not authorized for this boutique application." }, { status: 403 });
    }

    const access = getBoutiquePartnerAccess(application);
    if (!access.canManageProducts) {
      return NextResponse.json(
        {
          code: access.reason,
          error: access.message,
          access,
        },
        { status: 402 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, WebP, or AVIF." },
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
    const safeBaseName = sanitizeBaseName(file.name) || "partner-product";
    const safeApplicationId = applicationId.replace(/[^a-z0-9-]/gi, "").slice(0, 42);
    const filename = `${safeApplicationId}-${Date.now()}-${randomUUID().slice(0, 8)}-${safeBaseName}.${extension}`;

    if (hasVercelBlobStorage()) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/partners/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (isHostedVercelRuntime()) {
      return NextResponse.json(
        {
          code: "upload_storage_not_configured",
          error: "Image uploads need Vercel Blob storage on the hosted site. Connect Vercel Blob or add BLOB_READ_WRITE_TOKEN, then try again.",
        },
        { status: 503 }
      );
    }

    const url = await saveLocally(file, filename);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Partner upload API error:", error);
    return NextResponse.json({ error: "Unable to store the uploaded image." }, { status: 500 });
  }
}

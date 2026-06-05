import type { BlobAccessType } from "@vercel/blob";

type BlobTextOptions = {
  access: BlobAccessType;
  contentType?: string;
};

export function isHostedVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

export function hasVercelBlobStorage(): boolean {
  const readWriteToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();

  return Boolean(readWriteToken || (storeId && (oidcToken || isHostedVercelRuntime())));
}

export function hasVercelBlobReadWriteToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function hasVercelBlobJsonSnapshotStorage(): boolean {
  const enabled = String(process.env.BLOB_JSON_SNAPSHOTS ?? "").trim().toLowerCase();
  return hasVercelBlobReadWriteToken() && ["1", "true", "yes"].includes(enabled);
}

export async function readBlobText(
  pathname: string,
  options: Pick<BlobTextOptions, "access">
): Promise<string | null> {
  const { get } = await import("@vercel/blob");
  const blob = await get(pathname, {
    access: options.access,
    useCache: false,
  });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return null;
  }

  return new Response(blob.stream).text();
}

export async function readBlobTextWithLegacyPublicFallback(
  pathname: string,
  options: Pick<BlobTextOptions, "access">
): Promise<string | null> {
  const primary = await readBlobText(pathname, options);
  if (primary !== null || options.access === "public") {
    return primary;
  }

  return readBlobText(pathname, { access: "public" });
}

export async function writeBlobText(
  pathname: string,
  text: string,
  options: BlobTextOptions
): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(pathname, text, {
    access: options.access,
    allowOverwrite: true,
    contentType: options.contentType ?? "text/plain",
  });
}

import type { NextRequest } from "next/server";

function clean(value: unknown): string {
  return String(value ?? "").trim().replace(/\/+$/, "");
}

function isLocalhostUrl(url: string): boolean {
  return /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
}

/**
 * Resolve public base URL without using localhost in production.
 * Priority: request origin -> VERCEL_URL -> NEXT_PUBLIC_URL (if not localhost in prod) -> localhost (dev only).
 */
export function getPublicBaseUrl(req?: NextRequest): string {
  if (req) {
    try {
      const origin = req.nextUrl?.origin;
      if (origin && !isLocalhostUrl(origin) ) return clean(origin);
      // In local dev, request origin *is* localhost - allow it there.
      if (origin && process.env.NODE_ENV !== "production") return clean(origin);
    } catch {
      // ignore
    }
    const host =
      req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      req.headers.get("host")?.split(",")[0]?.trim();
    const proto =
      req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      (process.env.NODE_ENV === "production" ? "https" : "http");
    if (host && !/^localhost(:\d+)?$/i.test(host)) {
      return `${proto}://${host}`;
    }
    if (host && process.env.NODE_ENV !== "production") {
      return `${proto}://${host}`;
    }
  }

  const vercelUrl = clean(process.env.VERCEL_URL || "");
  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  const publicUrl = clean(process.env.NEXT_PUBLIC_URL || "");
  if (publicUrl) {
    if (isLocalhostUrl(publicUrl) && process.env.NODE_ENV === "production") {
      // Misconfigured production env - fall through to Vercel/host detection.
    } else {
      return publicUrl;
    }
  }

  if (process.env.NODE_ENV === "production") {
    // Last resort in production: relative URLs handled by caller.
    // Return empty so callers can use relative paths instead of localhost.
    return "";
  }
  return "http://localhost:3000";
}

export function withBaseUrl(path: string, req?: NextRequest): string {
  const base = getPublicBaseUrl(req);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) return normalizedPath;
  return `${base}${normalizedPath}`;
}

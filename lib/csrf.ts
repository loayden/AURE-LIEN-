import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const CSRF_COOKIE_NAME = "csrf_token";
export const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export function getCsrfToken(req: NextRequest): string | null {
  const fromCookie = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (fromCookie && fromCookie.length >= 16) return fromCookie;
  const fromHeader = req.headers.get(CSRF_HEADER_NAME);
  if (fromHeader && fromHeader.length >= 16) return fromHeader;
  return null;
}

export function setCsrfCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export function validateCsrfRequest(req: NextRequest): boolean {
  // Double-submit: cookie must match header/body token on mutations.
  // Safe methods skip validation.
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;
  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken =
    req.headers.get(CSRF_HEADER_NAME) ?? req.headers.get("x-csrf_token");
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length < 16 || headerToken.length < 16) return false;
  return cookieToken === headerToken;
}

export function isOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin / non-browser clients
  try {
    const originUrl = new URL(origin);
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
    if (!host) return true;
    const hostOnly = host.split(",")[0].trim().split(":")[0].toLowerCase();
    return originUrl.hostname.toLowerCase() === hostOnly;
  } catch {
    return false;
  }
}

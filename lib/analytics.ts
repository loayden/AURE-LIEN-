"use client";

/**
 * Lightweight client analytics (no external vendor required).
 * Beacon to /api/analytics; fails silently offline.
 */

export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "search"
  | "wishlist_add"
  | "auth_signup";

export function trackEvent(
  event: AnalyticsEventName,
  properties: Record<string, string | number | boolean | undefined> = {}
): void {
  try {
    const body = JSON.stringify({
      event,
      path: typeof window !== "undefined" ? window.location.pathname : "",
      ...properties,
    });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // analytics must never break UX
  }
}

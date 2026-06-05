export const CUSTOMER_DELIVERY_WINDOW =
  process.env.NEXT_PUBLIC_CUSTOMER_DELIVERY_WINDOW?.trim() ||
  "within 2-4 business days inside Egypt";

export const PARTNER_APPLICATION_REVIEW_WINDOW =
  process.env.NEXT_PUBLIC_PARTNER_APPLICATION_REVIEW_WINDOW?.trim() ||
  "within 24-48 hours";

export const PARTNER_PRODUCT_REVIEW_WINDOW =
  process.env.NEXT_PUBLIC_PARTNER_PRODUCT_REVIEW_WINDOW?.trim() ||
  "within 24 hours";

export function formatDeliveryWindow(city?: string): string {
  const normalizedCity = String(city ?? "").trim().toLowerCase();
  if (["cairo", "القاهرة", "giza", "الجيزة"].includes(normalizedCity)) {
    return process.env.NEXT_PUBLIC_CAIRO_DELIVERY_WINDOW?.trim() || "within 24-48 hours";
  }
  return CUSTOMER_DELIVERY_WINDOW;
}

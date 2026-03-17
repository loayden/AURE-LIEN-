/**
 * Shared utilities for AURELIA Luxury Ecommerce
 */

export function formatCurrency(amount: number, currency = "EGP"): string {
  return amount.toLocaleString("en-EG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

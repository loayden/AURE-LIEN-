/**
 * Multi-currency display helper.
 * Stored prices are always EGP. Conversion is display-only.
 */
export const BASE_CURRENCY = "EGP";

const RATES: Record<string, number> = {
  EGP: 1,
  USD: 1 / 48,
  SAR: 1 / 12.8,
  AED: 1 / 13.05,
};

export function getSupportedCurrencies(): string[] {
  return Object.keys(RATES);
}

export function convertPrice(amountEgp: number, currency: string): number {
  const code = String(currency ?? "EGP").toUpperCase();
  const rate = RATES[code] ?? 1;
  return Math.round(Number(amountEgp) * rate * 100) / 100;
}

export function formatConvertedPrice(amountEgp: number, currency: string): string {
  const code = String(currency ?? "EGP").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).format(convertPrice(amountEgp, code));
  } catch {
    return `${convertPrice(amountEgp, code).toFixed(2)} ${code}`;
  }
}

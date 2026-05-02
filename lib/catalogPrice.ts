export const CATALOG_PRICE_OFFSET_EGP = 0;

export function applyCatalogPriceOffset(price: number): number {
  return Number(price ?? 0) + CATALOG_PRICE_OFFSET_EGP;
}

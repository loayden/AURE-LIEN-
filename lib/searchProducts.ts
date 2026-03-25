import productsData from "@/lib/productsData";
import type { Product } from "@/lib/types";

export const SEARCH_CATEGORIES = [
  "jackets-coats",
  "suits",
  "shirts",
  "knitwear",
  "footwear",
  "sneakers",
  "boots",
  "loafers",
  "lace-ups",
  "accessories",
  "sunglasses",
  "bags-wallets",
  "belts",
];

interface SearchOptions {
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  color?: string;
  limit?: number;
}

function matchesColor(product: Product, color?: string) {
  if (!color) return true;

  const normalizedColor = color.trim().toLowerCase();
  if (!normalizedColor) return true;

  return product.colors?.some((entry) => entry.toLowerCase().includes(normalizedColor));
}

export function searchCatalogProducts(query: string, options: SearchOptions = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  const terms = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  const results = productsData.filter((product) => {
    const category = String(product.category ?? "").trim();
    const categoryFilter = options.category?.trim();

    if (categoryFilter && category !== categoryFilter) return false;
    if (options.minPrice != null && product.price < options.minPrice) return false;
    if (options.maxPrice != null && product.price > options.maxPrice) return false;
    if (!matchesColor(product, options.color)) return false;

    if (!terms.length) return true;

    const haystack = [
      product.name,
      product.description,
      product.category,
      ...(product.colors ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });

  if (options.limit && options.limit > 0) {
    return results.slice(0, options.limit);
  }

  return results;
}

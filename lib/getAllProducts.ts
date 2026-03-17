/**
 * Server-only: returns productsData + products from data/products.json
 */
import productsData from "./productsData";
import { readProductsJson } from "./productsJson";

let cache: Awaited<ReturnType<typeof loadAllProducts>> | null = null;

async function loadAllProducts() {
  const fromJson = await readProductsJson();
  const ids = new Set(productsData.map((p) => p._id));
  const extra = fromJson.filter((p) => !ids.has(p._id));
  return [...productsData, ...extra];
}

export async function getAllProducts() {
  if (cache) return cache;
  cache = await loadAllProducts();
  return cache;
}

export function clearProductsCache() {
  cache = null;
}

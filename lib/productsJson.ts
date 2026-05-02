import { promises as fs } from "fs";
import { paths } from "./dataPaths";

export interface ProductRecord {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  size: string[];
  colors: string[];
  description?: string;
  stock?: number;
}

export async function readProductsJson(): Promise<ProductRecord[]> {
  try {
    const data = await fs.readFile(paths.products, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function appendProductJson(product: ProductRecord): Promise<void> {
  const list = await readProductsJson();
  list.push(product);
  await fs.writeFile(paths.products, JSON.stringify(list, null, 2));
}

export async function setProductsJson(products: ProductRecord[]): Promise<void> {
  await fs.writeFile(paths.products, JSON.stringify(products, null, 2));
}

export async function updateProductJson(
  productId: string,
  updates: Partial<ProductRecord>
): Promise<ProductRecord | null> {
  const list = await readProductsJson();
  const index = list.findIndex((product) => String(product._id) === String(productId));

  if (index === -1) return null;

  const updated = {
    ...list[index],
    ...updates,
    _id: list[index]._id,
  };
  list[index] = updated;
  await setProductsJson(list);
  return updated;
}

export async function removeProductJson(productId: string): Promise<boolean> {
  const list = await readProductsJson();
  const next = list.filter((product) => String(product._id) !== String(productId));

  if (next.length === list.length) return false;

  await setProductsJson(next);
  return true;
}

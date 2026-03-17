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

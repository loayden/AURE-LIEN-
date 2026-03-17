import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export const categoryMap: Record<string, string> = {
  "jackets-coats": "Jackets & Coats",
  "bags-wallets": "Bags & Wallets",
  "lace-ups": "Lace Ups",
  "suits": "Suits",
  "shirts": "Shirts",
  "sneakers": "Sneakers",
  "boots": "Boots",
  "loafers": "Loafers",
  "sunglasses": "Sunglasses",
  "belts": "Belts",
  "knitwear": "Knitwear",
};

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFlexibleCategoryRegex(input: string): RegExp {
  // Match common variants:
  // - slug: "jackets-coats"
  // - display: "Jackets & Coats"
  // - spaces/hyphens/& differences: "Jackets Coats", "Jackets-Coats"
  const tokens = input
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .split(/[\s-_]+/g)
    .map((t) => t.trim())
    .filter(Boolean);

  if (tokens.length === 0) return /^$/;

  const pattern = `^${tokens.map(escapeRegex).join("[\\s&-]*")}$`;
  return new RegExp(pattern, "i");
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    let productsList;
    if (category) {
      const decoded = decodeURIComponent(category).trim();
      const normalizedKey = decoded.toLowerCase();
      const mappedCategory = categoryMap[normalizedKey] || decoded;

      const regexes = [
        buildFlexibleCategoryRegex(decoded),
        buildFlexibleCategoryRegex(mappedCategory),
      ];

      productsList = await Product.find({ $or: regexes.map((re) => ({ category: { $regex: re } })) })
        .limit(50)
        .sort({ createdAt: -1 })
        .lean();
    } else {
      productsList = await Product.find({}).limit(50).sort({ createdAt: -1 }).lean();
    }

    const publicImagesDir = path.join(process.cwd(), "public", "images");
    const placeholderPath = "/images/placeholder.svg";

    const updatedProducts = productsList.map(product => {
      if (Array.isArray(product.images)) {
        product.images = product.images.map((imagePath: string) => {
          const imageFileName = path.basename(imagePath);
          const fullImagePath = path.join(publicImagesDir, imageFileName);
          if (fs.existsSync(fullImagePath)) {
            return imagePath;
          } else {
            return placeholderPath;
          }
        });
      }
      return product;
    });

    return NextResponse.json(updatedProducts || [], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

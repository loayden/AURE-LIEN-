import connectDB from '@/lib/connectDB';
import Product from "@/models/Product";
import fs from 'fs';
import { NextRequest, NextResponse } from "next/server";
import path from 'path';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const product = await Product.findById(id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const fallbackImage = '/images/placeholder.svg';

  const validatedImages = product.images.map((imgPath: string) => {
    const fullPath = path.join(imagesDir, imgPath.replace(/^\/images\//, ''));
    if (fs.existsSync(fullPath)) {
      return imgPath;
    } else {
      return fallbackImage;
    }
  });

  const productObj = product.toObject();
  productObj.images = validatedImages;

  return NextResponse.json(productObj);
}
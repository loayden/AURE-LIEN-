import connectDB from "@/lib/connectDB";
import { CATALOG_PRICE_OFFSET_EGP } from "@/lib/catalogPrice";
import { getAllProducts } from "@/lib/getAllProducts";
import prisma from "@/lib/prisma";
import ProductModel from "@/models/Product";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  await connectDB();

  const catalog = await getAllProducts();
  const ids = catalog.map((product) => String(product._id));
  const deletedInMongo = new Set(
    (await ProductModel.find({ _id: { $in: ids }, deleted: true }).select("_id").lean())
      .map((product) => String(product._id))
  );
  const activeCatalog = catalog.filter((product) => !deletedInMongo.has(String(product._id)));

  await ProductModel.bulkWrite(
    activeCatalog.map((product) => ({
      updateOne: {
        filter: { _id: String(product._id) },
        update: {
          $set: {
            _id: String(product._id),
            name: product.name,
            category: product.category,
            price: Math.max(0, Number(product.price) - CATALOG_PRICE_OFFSET_EGP),
            images: product.images ?? [],
            size: product.size ?? [],
            colors: product.colors ?? [],
            description: product.description,
            material: product.material,
            stock: typeof product.stock === "number" ? product.stock : 999,
            deleted: false,
          },
          $unset: { deletedAt: "" },
        },
        upsert: true,
      },
    }))
  );

  await Promise.all(
    activeCatalog.map((product) => {
      const id = String(product._id);
      return prisma.product.upsert({
        where: { id },
        create: {
          id,
          name: product.name,
          slug: slugify(id),
          description: product.description,
          price: Number(product.price) || 0,
          category: product.category,
          images: product.images ?? [],
          sizes: product.size ?? [],
          colors: product.colors ?? [],
          material: product.material,
          stock: typeof product.stock === "number" ? product.stock : 999,
          sku: id,
          tags: [product.category].filter(Boolean),
          isActive: true,
        },
        update: {
          name: product.name,
          description: product.description,
          price: Number(product.price) || 0,
          category: product.category,
          images: product.images ?? [],
          sizes: product.size ?? [],
          colors: product.colors ?? [],
          material: product.material,
          tags: [product.category].filter(Boolean),
          isActive: true,
        },
      });
    })
  );

  console.log(JSON.stringify({ synced: activeCatalog.length, skippedDeleted: catalog.length - activeCatalog.length }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

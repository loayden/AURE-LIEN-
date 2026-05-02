import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/getAllProducts";

const CATEGORY_ROUTES = [
  "pants-denim",
  "footwear",
  "accessories",
  "jackets-coats",
  "suits",
  "shirts",
  "knitwear",
  "denim",
  "jeans",
  "korean",
  "boots",
  "loafers",
  "lace-ups",
  "sneakers",
  "sunglasses",
  "belts",
  "bags-wallets",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_URL || "https://maisonaurelia.com").replace(/\/$/, "");
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/collection`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/lookbook`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/outfit-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/discover`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/cart`, lastModified: now, changeFrequency: "always", priority: 0.6 },
    { url: `${base}/checkout`, lastModified: now, changeFrequency: "always", priority: 0.4 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "always", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_ROUTES.map((route) => ({
    url: `${base}/${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product._id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}

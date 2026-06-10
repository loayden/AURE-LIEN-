import { MetadataRoute } from "next";
import productsData from "@/lib/productsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_URL || "https://maisonaurelia.com";
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/collection`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/boutiques`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: "always", priority: 0.6 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "always", priority: 0.6 },
  ];
  const productPages: MetadataRoute.Sitemap = productsData.map((p) => ({
    url: `${base}/product/${p._id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...productPages];
}

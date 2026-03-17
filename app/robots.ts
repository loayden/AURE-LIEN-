import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_URL || "https://maisonaurelia.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account", "/checkout"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

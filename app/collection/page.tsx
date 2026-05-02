"use client";

import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import type { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowRight, Layers, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CategoryConfig = {
  title: string;
  href: string;
  image: string;
  aliases: string[];
  copy: string;
};

const CATEGORIES: CategoryConfig[] = [
  {
    title: "Jackets & Coats",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
    aliases: ["jackets", "coats", "jackets & coats"],
    copy: "Structured outerwear, leather layers, and lighter jackets.",
  },
  {
    title: "Suits",
    href: "/suits",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
    aliases: ["suits", "tailoring"],
    copy: "Tailoring for formal, business, and evening wardrobes.",
  },
  {
    title: "Shirts",
    href: "/shirts",
    image: withPublicAssetVersion("/uploads/main.jpg"),
    aliases: ["shirts", "shirt"],
    copy: "Clean shirting and easy layering pieces.",
  },
  {
    title: "Knitwear",
    href: "/knitwear",
    image: withPublicAssetVersion("/uploads/Textured Waffle-Knit Zip Jacket.jpg"),
    aliases: ["knitwear", "knit", "sweater"],
    copy: "Soft textures and warmer everyday layers.",
  },
  {
    title: "Denim",
    href: "/denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
    aliases: ["denim", "jeans"],
    copy: "Denim cuts with clean proportions and daily wearability.",
  },
  {
    title: "Footwear",
    href: "/footwear",
    image: withPublicAssetVersion("/uploads/footwear.jpg"),
    aliases: ["sneakers", "loafers", "lace", "boots", "footwear"],
    copy: "Sneakers, loafers, boots, and lace-up shoes.",
  },
  {
    title: "Accessories",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/accessories.jpg"),
    aliases: ["sunglasses", "bags", "wallets", "belts", "accessories"],
    copy: "Finishing pieces: leather goods, belts, and eyewear.",
  },
  {
    title: "Pants / Denim",
    href: "/pants-denim",
    image: withPublicAssetVersion("/uploads/pants-hero.mp4"),
    aliases: ["pants", "denim", "jeans", "korean"],
    copy: "Trousers, denim, and relaxed silhouettes.",
  },
];

function matchesCategory(product: Product, config: CategoryConfig) {
  const category = String(product.category ?? "").toLowerCase();
  return config.aliases.some((alias) => {
    const normalized = alias.toLowerCase();
    return category.includes(normalized) || normalized.includes(category);
  });
}

function categoryProducts(products: Product[], config: CategoryConfig) {
  return products.filter((product) => matchesCategory(product, config));
}

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store", signal: controller.signal });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || "Unable to load products");
        }
        setProducts(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load products");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const categoryCards = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        products: categoryProducts(products, category),
      })),
    [products]
  );

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <main className="liquid-page pb-28">
      <section className="relative isolate min-h-[68svh] overflow-hidden">
        <Image
          src={withPublicAssetVersion("/uploads/collections.jpg")}
          alt="BOUT collection"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,0.92),rgba(10,9,8,0.56),rgba(10,9,8,0.18))]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0A0908] to-transparent" />
        <div className="page-wrap relative z-10 flex min-h-[68svh] items-end pb-14 pt-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">Collection Gateway</p>
            <h1 className="title-display text-[clamp(3.2rem,10vw,7rem)] leading-[0.86]">
              Shop by <em className="gold-italic">category</em>
            </h1>
            <p className="hero-body-copy mt-5 max-w-2xl text-white/58">
              Move through the catalogue by silhouette, wardrobe role, and finishing piece.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop All Products
                <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </Link>
              <Link href="/lookbook" className="btn-ghost justify-center">
                View Lookbook
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-12 sm:px-6 sm:pt-16 md:px-10">
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Departments</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.5rem)]">
                Clear paths into the <em className="gold-italic">edit</em>
              </h2>
            </div>
            <span className="count-pill">
              {loading ? "Loading products" : `${products.length} live products`}
            </span>
          </div>

          {error ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] px-5 py-12 text-center">
              <PackageSearch className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
              <p className="body-copy body-copy-strong">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {categoryCards.map((category, index) => {
                const imageIsVideo = category.image.includes(".mp4");
                return (
                  <motion.div
                    key={category.href}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.5 }}
                  >
                    <Link href={category.href} className="group block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035]">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {imageIsVideo ? (
                          <video
                            src={category.image}
                            muted
                            autoPlay
                            loop
                            playsInline
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-black/25 to-transparent" />
                        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                          <span className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-white/62 backdrop-blur-md">
                            {loading ? "..." : `${category.products.length} pieces`}
                          </span>
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/28 text-brass backdrop-blur-md">
                            <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="font-serif text-3xl font-light text-white">{category.title}</h3>
                          <p className="mt-3 text-sm font-light leading-6 text-white/48">{category.copy}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-10">
        <div className="page-wrap">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Catalogue Preview</p>
              <h2 className="title-display text-[clamp(2rem,4vw,3.4rem)]">
                Recent pieces across <em className="gold-italic">categories</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost justify-center sm:justify-start">
              View All
            </Link>
          </div>

          {loading ? (
            <ProductSkeleton count={4} />
          ) : featuredProducts.length > 0 ? (
            <div className="catalog-grid catalog-grid-mobile-full">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] px-5 py-12 text-center">
              <Layers className="mx-auto mb-4 h-9 w-9 text-white/25" strokeWidth={1.3} />
              <p className="body-copy body-copy-strong">No products are available right now.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

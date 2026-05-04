import type { Product } from "@/lib/types";
import { withPublicAssetVersion } from "@/lib/publicAsset";

export type StockState = "in-stock" | "low-stock" | "sold-out" | "available";
export type SortValue = "featured" | "newest" | "price-low" | "price-high";
export type AvailabilityFilter = "all" | StockState;

export type CategoryMeta = {
  slug: string;
  title: string;
  short: string;
  href: string;
  image: string;
  heroImage: string;
  copy: string;
  seo: string;
  tokens: string[];
};

export const CATEGORY_META: CategoryMeta[] = [
  {
    slug: "jackets-coats",
    title: "Jackets & Coats",
    short: "Jackets",
    href: "/jackets-coats",
    image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"),
    copy: "Structured outerwear, leather layers, and coat silhouettes with enough presence to lead an outfit.",
    seo: "Shop BOUT jackets and coats in Egypt, including refined outerwear, leather jackets, and seasonal layers.",
    tokens: ["jackets-coats", "jacket", "jackets", "coat", "coats", "outerwear"],
  },
  {
    slug: "pants-denim",
    title: "Pants & Denim",
    short: "Pants",
    href: "/pants-denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
    heroImage: withPublicAssetVersion("/uploads/pants-hero.mp4"),
    copy: "Denim, korean fits, and relaxed trousers organized for quick scan-and-compare browsing.",
    seo: "Browse BOUT pants and denim, including jeans, baggy pants, and korean trouser silhouettes.",
    tokens: ["pants-denim", "denim", "jeans", "korean", "baggy", "pants", "trouser", "trousers"],
  },
  {
    slug: "footwear",
    title: "Footwear",
    short: "Shoes",
    href: "/footwear",
    image: withPublicAssetVersion("/uploads/footwear.jpg"),
    heroImage: withPublicAssetVersion("/uploads/footwear.mp4"),
    copy: "Sneakers, loafers, boots, and lace-ups for finishing formal and off-duty looks.",
    seo: "Shop BOUT footwear in Egypt, including sneakers, loafers, boots, and lace-up shoes.",
    tokens: ["footwear", "sneakers", "boots", "loafers", "lace-ups", "lace ups", "shoes"],
  },
  {
    slug: "accessories",
    title: "Accessories",
    short: "Finish",
    href: "/accessories",
    image: withPublicAssetVersion("/uploads/accessories.jpg"),
    heroImage: withPublicAssetVersion("/uploads/accessories.mp4"),
    copy: "Belts, sunglasses, bags, and wallets that complete the outfit without crowding it.",
    seo: "Explore BOUT accessories, including belts, bags, wallets, sunglasses, and finishing pieces.",
    tokens: ["accessories", "sunglasses", "bags-wallets", "bags", "wallets", "belts", "belt"],
  },
];

export const SUBCATEGORY_META: CategoryMeta[] = [
  {
    slug: "suits",
    title: "Suits",
    short: "Suits",
    href: "/suits",
    image: withPublicAssetVersion("/uploads/Suits.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Suits.jpg"),
    copy: "Tailored sets and sharper silhouettes for formal, evening, and business dressing.",
    seo: "Shop tailored suits and polished occasion menswear from BOUT.",
    tokens: ["suits", "suit", "tailoring", "tailored"],
  },
  {
    slug: "shirts",
    title: "Shirts",
    short: "Shirts",
    href: "/shirts",
    image: withPublicAssetVersion("/uploads/shirts.jpg"),
    heroImage: withPublicAssetVersion("/uploads/shirts.jpg"),
    copy: "Clean shirting, polos, and everyday tops with a quieter wardrobe rhythm.",
    seo: "Shop BOUT shirts, polos, and refined everyday tops.",
    tokens: ["shirts", "shirt", "polo", "top"],
  },
  {
    slug: "knitwear",
    title: "Knitwear",
    short: "Knits",
    href: "/knitwear",
    image: withPublicAssetVersion("/uploads/collections.jpg"),
    heroImage: withPublicAssetVersion("/uploads/collections.jpg"),
    copy: "Soft layers and knit silhouettes for understated daily dressing.",
    seo: "Shop BOUT knitwear and refined soft layers.",
    tokens: ["knitwear", "knit", "sweater", "knits"],
  },
  {
    slug: "denim",
    title: "Denim",
    short: "Denim",
    href: "/denim",
    image: withPublicAssetVersion("/uploads/denim.jpg"),
    heroImage: withPublicAssetVersion("/uploads/denim.jpg"),
    copy: "Denim fits with clear proportions, washes, and easy product comparison.",
    seo: "Shop BOUT denim and jeans.",
    tokens: ["denim", "jeans", "jean"],
  },
  {
    slug: "jeans",
    title: "Jeans",
    short: "Jeans",
    href: "/jeans",
    image: withPublicAssetVersion("/uploads/baggy.jpg"),
    heroImage: withPublicAssetVersion("/uploads/baggy.jpg"),
    copy: "Relaxed denim and baggy proportions for a stronger casual silhouette.",
    seo: "Shop BOUT jeans and relaxed denim.",
    tokens: ["jeans", "baggy", "denim"],
  },
  {
    slug: "korean",
    title: "Korean Pants",
    short: "Korean",
    href: "/korean",
    image: withPublicAssetVersion("/uploads/korean.jpg"),
    heroImage: withPublicAssetVersion("/uploads/korean.jpg"),
    copy: "Modern trouser shapes with clean taper, drape, and sharper everyday polish.",
    seo: "Shop korean pants and modern trouser silhouettes from BOUT.",
    tokens: ["korean", "pants", "trouser"],
  },
  {
    slug: "boots",
    title: "Boots",
    short: "Boots",
    href: "/boots",
    image: withPublicAssetVersion("/uploads/footwear.jpg"),
    heroImage: withPublicAssetVersion("/uploads/footwear.jpg"),
    copy: "Boots with enough structure to anchor outerwear and denim.",
    seo: "Shop BOUT boots.",
    tokens: ["boots", "boot"],
  },
  {
    slug: "sneakers",
    title: "Sneakers",
    short: "Sneakers",
    href: "/sneakers",
    image: withPublicAssetVersion("/uploads/Sneakers.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Sneakers.jpg"),
    copy: "Sculpted casual footwear for clean daily styling.",
    seo: "Shop BOUT sneakers.",
    tokens: ["sneakers", "sneaker"],
  },
  {
    slug: "loafers",
    title: "Loafers",
    short: "Loafers",
    href: "/loafers",
    image: withPublicAssetVersion("/uploads/Loafers.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Loafers.jpg"),
    copy: "Loafers for business, evening, and relaxed formal dressing.",
    seo: "Shop BOUT loafers.",
    tokens: ["loafers", "loafer"],
  },
  {
    slug: "lace-ups",
    title: "Lace-Ups",
    short: "Lace-Ups",
    href: "/lace-ups",
    image: withPublicAssetVersion("/uploads/Lace-Ups.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Lace-Ups.jpg"),
    copy: "Formal lace-up shoes for tailored and evening looks.",
    seo: "Shop BOUT lace-up shoes.",
    tokens: ["lace-ups", "lace ups", "lace", "oxford", "derby"],
  },
  {
    slug: "sunglasses",
    title: "Sunglasses",
    short: "Sunglasses",
    href: "/sunglasses",
    image: withPublicAssetVersion("/uploads/sunglasses.jpg"),
    heroImage: withPublicAssetVersion("/uploads/sunglasses.jpg"),
    copy: "Eyewear with restrained frames and finishing detail.",
    seo: "Shop BOUT sunglasses.",
    tokens: ["sunglasses", "sunglass", "eyewear"],
  },
  {
    slug: "bags-wallets",
    title: "Bags & Wallets",
    short: "Bags",
    href: "/bags-wallets",
    image: withPublicAssetVersion("/uploads/Bags & Wallets.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Bags & Wallets.jpg"),
    copy: "Leather goods, bags, and wallets for daily carry.",
    seo: "Shop BOUT bags and wallets.",
    tokens: ["bags-wallets", "bags", "bag", "wallets", "wallet"],
  },
  {
    slug: "belts",
    title: "Belts",
    short: "Belts",
    href: "/belts",
    image: withPublicAssetVersion("/uploads/Belts.jpg"),
    heroImage: withPublicAssetVersion("/uploads/Belts.jpg"),
    copy: "Belts and brass details for finishing a look cleanly.",
    seo: "Shop BOUT belts.",
    tokens: ["belts", "belt"],
  },
];

export const ALL_CATEGORY_META = [...CATEGORY_META, ...SUBCATEGORY_META];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return ALL_CATEGORY_META.find((item) => item.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(Number(price) || 0);
}

export function productHref(product: Pick<Product, "_id">) {
  return `/product/${encodeURIComponent(String(product._id))}`;
}

export function productImage(product: Pick<Product, "images">) {
  return product.images?.[0] || "/images/placeholder.svg";
}

export function formatCategoryLabel(category?: string) {
  return String(category ?? "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function stockState(product: Pick<Product, "stock">): StockState {
  if (typeof product.stock !== "number") return "available";
  if (product.stock <= 0) return "sold-out";
  if (product.stock <= 3) return "low-stock";
  return "in-stock";
}

export function stockLabel(product: Pick<Product, "stock">) {
  const state = stockState(product);
  if (state === "sold-out") return "Sold out";
  if (state === "low-stock") return `${product.stock} left`;
  if (state === "in-stock") return "In stock";
  return "Available";
}

export function categoryMatches(product: Pick<Product, "category">, slugOrToken: string) {
  const normalized = String(product.category ?? "").toLowerCase();
  const meta = getCategoryMeta(slugOrToken);
  const tokens = meta?.tokens ?? [slugOrToken];
  return tokens.some((token) => normalized.includes(token.toLowerCase()));
}

export function uniqueProductSizes(products: Product[]) {
  return Array.from(new Set(products.flatMap((product) => product.size ?? []).filter(Boolean))).sort();
}

export function uniqueProductColors(products: Product[]) {
  return Array.from(new Set(products.flatMap((product) => product.colors ?? []).filter(Boolean))).sort();
}

export function filterProducts(
  products: Product[],
  filters: {
    query?: string;
    category?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    size?: string;
    color?: string;
    availability?: AvailabilityFilter;
  }
) {
  const terms = filters.query?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  const category = filters.category?.trim();
  const size = filters.size?.trim().toLowerCase();
  const color = filters.color?.trim().toLowerCase();
  const availability = filters.availability ?? "all";

  return products.filter((product) => {
    if (category && !categoryMatches(product, category)) return false;
    if (filters.minPrice != null && product.price < filters.minPrice) return false;
    if (filters.maxPrice != null && product.price > filters.maxPrice) return false;
    if (size && !(product.size ?? []).some((value) => value.toLowerCase() === size)) return false;
    if (color && !(product.colors ?? []).some((value) => value.toLowerCase().includes(color))) return false;
    if (availability !== "all" && stockState(product) !== availability) return false;

    if (terms.length) {
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.material,
        ...(product.colors ?? []),
        ...(product.size ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sort: SortValue) {
  const next = [...products];
  if (sort === "price-low") return next.sort((a, b) => a.price - b.price);
  if (sort === "price-high") return next.sort((a, b) => b.price - a.price);
  if (sort === "newest") return next.reverse();
  return next;
}

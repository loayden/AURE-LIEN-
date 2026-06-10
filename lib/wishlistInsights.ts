import {
  STYLE_INTENT_META,
  formatCategoryLabel,
  getProductConfidence,
  productMatchesStyleIntent,
} from "@/lib/commerce";
import type { StyleIntent } from "@/lib/commerce";
import type { Product } from "@/lib/types";

export type WishlistIntentInsight = {
  value: StyleIntent;
  label: string;
  count: number;
};

export type WishlistInsight = {
  savedCount: number;
  totalValue: number;
  averageConfidence: number;
  decisionScore: number;
  topCategory: string;
  intentInsights: WishlistIntentInsight[];
  strongestIntent: WishlistIntentInsight | null;
  shortlist: Product[];
  guidance: {
    title: string;
    copy: string;
    href: string;
    label: string;
  };
};

function scoreProductForShortlist(product: Product) {
  const confidence = getProductConfidence(product);
  const stockBonus = confidence.stockState === "sold-out" ? -4 : confidence.stockState === "low-stock" ? 2 : 3;
  const price = Number(product.price) || 0;

  return confidence.score * 10 + stockBonus + Math.min(price / 1000, 8);
}

export function getWishlistInsights(products: Product[]): WishlistInsight {
  const savedCount = products.length;
  const totalValue = products.reduce((sum, product) => sum + (Number(product.price) || 0), 0);
  const confidenceScores = products.map((product) => getProductConfidence(product).score);
  const averageConfidence = savedCount
    ? Math.round((confidenceScores.reduce((sum, score) => sum + score, 0) / savedCount) * 10) / 10
    : 0;

  const categoryCounts = new Map<string, number>();
  for (const product of products) {
    const label = formatCategoryLabel(product.category || "Catalog") || "Catalog";
    categoryCounts.set(label, (categoryCounts.get(label) ?? 0) + 1);
  }
  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No category";

  const intentInsights = STYLE_INTENT_META.filter((intent) => intent.value !== "all").map((intent) => ({
    value: intent.value,
    label: intent.label,
    count: products.filter((product) => productMatchesStyleIntent(product, intent.value)).length,
  }));
  const strongestIntent = intentInsights.filter((intent) => intent.count > 0).sort((a, b) => b.count - a.count)[0] ?? null;
  const coverageCount = intentInsights.filter((intent) => intent.count > 0).length;

  const decisionScore = Math.min(
    100,
    savedCount * 12 +
      coverageCount * 8 +
      Math.round(averageConfidence * 9) +
      (savedCount >= 3 ? 12 : 0)
  );

  const shortlist = [...products]
    .sort((a, b) => scoreProductForShortlist(b) - scoreProductForShortlist(a))
    .slice(0, 3);

  const guidance =
    savedCount === 0
      ? {
          title: "Start a sharper shortlist",
          copy: "Save three pieces to unlock better comparison, intent coverage, and checkout confidence.",
          href: "/shop",
          label: "Browse shop",
        }
      : savedCount < 3
        ? {
            title: "Add two more candidates",
            copy: "A three-piece shortlist makes price, fit, and styling tradeoffs easier to judge.",
            href: "/shop",
            label: "Add pieces",
          }
        : averageConfidence < 4.5
          ? {
              title: "Improve decision confidence",
              copy: "Prioritize saved pieces with images, sizes, colors, material notes, and available stock.",
              href: "/shop",
              label: "Refine shortlist",
            }
          : {
              title: "Ready to compare and buy",
              copy: "Your wishlist has enough signal. Review the strongest pieces and move the best fit to cart.",
              href: "/cart",
              label: "Open cart",
            };

  return {
    savedCount,
    totalValue,
    averageConfidence,
    decisionScore,
    topCategory,
    intentInsights,
    strongestIntent,
    shortlist,
    guidance,
  };
}

import assert from "node:assert/strict";
import test from "node:test";

import type { Product } from "@/lib/types";
import { getWishlistInsights } from "@/lib/wishlistInsights";

const jacket: Product = {
  _id: "jacket-1",
  name: "Black Tailored Work Jacket",
  category: "jackets-coats",
  price: 1800,
  images: ["/uploads/jacket.jpg"],
  size: ["M", "L"],
  colors: ["black"],
  material: "Wool blend",
  stock: 4,
};

const loafers: Product = {
  _id: "loafers-1",
  name: "Formal Leather Loafers",
  category: "loafers",
  price: 2100,
  images: ["/uploads/loafers.jpg"],
  size: ["42", "43"],
  colors: ["brown"],
  material: "Leather",
  stock: 2,
};

test("wishlist insights summarize saved products without persistence changes", () => {
  const insights = getWishlistInsights([jacket, loafers]);

  assert.equal(insights.savedCount, 2);
  assert.equal(insights.totalValue, 3900);
  assert.equal(insights.averageConfidence, 5);
  assert.ok(insights.decisionScore > 0);
  assert.equal(insights.shortlist.length, 2);
  assert.ok(insights.intentInsights.some((intent) => intent.value === "work" && intent.count === 2));
});

test("wishlist insights provide an empty-state action", () => {
  const insights = getWishlistInsights([]);

  assert.equal(insights.savedCount, 0);
  assert.equal(insights.decisionScore, 0);
  assert.equal(insights.guidance.href, "/shop");
  assert.equal(insights.shortlist.length, 0);
});

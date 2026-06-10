import assert from "node:assert/strict";
import test from "node:test";

import { filterProducts, getProductConfidence, productMatchesStyleIntent } from "@/lib/commerce";
import type { Product } from "@/lib/types";

const baseProduct: Product = {
  _id: "p-test",
  name: "Black Tailored Work Jacket",
  category: "jackets-coats",
  price: 1800,
  images: ["/uploads/test.jpg"],
  size: ["M", "L"],
  colors: ["black"],
  material: "Wool blend",
  stock: 4,
};

test("product confidence reads existing product fields without schema changes", () => {
  const confidence = getProductConfidence(baseProduct);

  assert.equal(confidence.stockState, "in-stock");
  assert.equal(confidence.hasImages, true);
  assert.equal(confidence.hasSizes, true);
  assert.equal(confidence.hasColors, true);
  assert.equal(confidence.hasMaterial, true);
  assert.equal(confidence.score, 5);
  assert.ok(confidence.badges.includes("Admin-reviewed"));
  assert.ok(confidence.badges.includes("Secure checkout"));
});

test("style intent matching works from existing catalog text", () => {
  assert.equal(productMatchesStyleIntent(baseProduct, "work"), true);
  assert.equal(productMatchesStyleIntent(baseProduct, "night"), true);
  assert.equal(productMatchesStyleIntent(baseProduct, "gift"), false);
});

test("product filtering supports outfit intent without backend data changes", () => {
  const products: Product[] = [
    baseProduct,
    {
      ...baseProduct,
      _id: "p-gift",
      name: "Leather Wallet Gift",
      category: "bags-wallets",
      colors: ["brown"],
    },
  ];

  assert.deepEqual(filterProducts(products, { styleIntent: "gift" }).map((product) => product._id), ["p-gift"]);
});

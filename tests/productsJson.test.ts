import assert from "node:assert/strict";
import test from "node:test";

import {
  applyProductDeletion,
  applyProductUpsert,
  getActiveProductRecords,
  getDeletedProductIds,
  type ProductStoreEntry,
} from "@/lib/productsJson";

const seedProduct = {
  _id: "seed-1",
  name: "Seed Jacket",
  category: "jackets-coats",
  price: 1200,
  images: ["/uploads/seed.jpg"],
  size: ["M"],
  colors: ["black"],
};

test("product deletion removes editable records from the active catalogue", () => {
  const entries: ProductStoreEntry[] = [seedProduct];

  const result = applyProductDeletion(entries, "seed-1");

  assert.equal(result.removed, true);
  assert.equal(result.tombstoned, false);
  assert.deepEqual(getActiveProductRecords(result.entries), []);
});

test("product deletion tombstones seed-only products so they stay hidden from shop merges", () => {
  const result = applyProductDeletion([], "p-built-in-1");

  assert.equal(result.removed, false);
  assert.equal(result.tombstoned, true);
  assert.deepEqual([...getDeletedProductIds(result.entries)], ["p-built-in-1"]);
});

test("product upsert edits records and clears a previous deletion tombstone", () => {
  const entries: ProductStoreEntry[] = [
    { _id: "p-built-in-1", deleted: true, deletedAt: "2026-05-09T00:00:00.000Z" },
  ];

  const result = applyProductUpsert(entries, {
    ...seedProduct,
    _id: "p-built-in-1",
    name: "Edited Jacket",
  });

  assert.deepEqual(getDeletedProductIds(result), new Set());
  assert.equal(getActiveProductRecords(result)[0]?.name, "Edited Jacket");
});

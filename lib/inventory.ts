import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Product from "@/models/Product";

export type StockIssue = {
  productId: string;
  name: string;
  available: number;
};

/**
 * Atomically decrement Mongo product stock.
 * - Products without numeric stock are untracked → skipped (legacy behavior).
 * - No Mongo configured → no-op success (legacy JSON behavior preserved).
 * - Uses `stock: { $gte: qty }` guard so concurrent checkouts can't oversell.
 */
export async function tryDecrementStock(
  items: Array<{ productId: string; quantity: number; name?: string }>
): Promise<{ ok: boolean; issues: StockIssue[] }> {
  if (!hasConfiguredMongoUri()) return { ok: true, issues: [] };
  try {
    await connectDB();
  } catch {
    return { ok: true, issues: [] };
  }

  const issues: StockIssue[] = [];
  for (const item of items) {
    const productId = String(item.productId ?? "").trim();
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    if (!productId) continue;
    try {
      const res = await Product.updateOne(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } }
      );
      if ((res.modifiedCount ?? 0) > 0) continue;
      const current = await Product.findOne({ _id: productId }).lean() as unknown as {
        stock?: unknown;
        name?: unknown;
      } | null;
      if (!current) continue; // validated upstream; catalog product (JSON) — nothing to decrement
      if (typeof current.stock !== "number") continue; // untracked stock
      issues.push({
        productId,
        name: String(item.name ?? current.name ?? productId),
        available: Math.max(0, current.stock),
      });
    } catch (error) {
      console.warn(
        "Stock decrement skipped:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
  return { ok: issues.length === 0, issues };
}

/** Best-effort restore after a failed order write. Never throws. */
export async function restoreStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<void> {
  if (!hasConfiguredMongoUri()) return;
  try {
    await connectDB();
  } catch {
    return;
  }
  for (const item of items) {
    const productId = String(item.productId ?? "").trim();
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    if (!productId) continue;
    try {
      await Product.updateOne({ _id: productId, stock: { $type: "number" } }, { $inc: { stock: qty } });
    } catch {
      // ignore — reconciliation over precision here
    }
  }
}

import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import Coupon from "@/models/Coupon";

export type CouponQuote = {
  code: string;
  kind: "percent" | "fixed";
  value: number;
  discount: number;
};

function normalizeCode(code: unknown): string {
  return String(code ?? "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

/**
 * Validate a coupon against a subtotal. Returns quote or error string.
 * Usage counting happens at order placement (atomic), not here.
 */
export async function quoteCoupon(
  code: unknown,
  subtotal: number
): Promise<{ quote: CouponQuote } | { error: string }> {
  const normalized = normalizeCode(code);
  if (!normalized) return { error: "Coupon code required" };
  if (!hasConfiguredMongoUri()) return { error: "Coupons are not available right now" };
  try {
    await connectDB();
    const coupon = await Coupon.findOne({ code: normalized }).lean() as unknown as {
      code: string;
      kind: string;
      value: number;
      minSubtotal?: number;
      maxUses?: number;
      usedCount?: number;
      active?: boolean;
      expiresAt?: Date;
    } | null;
    if (!coupon || coupon.active === false) return { error: "Invalid coupon code" };
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { error: "This coupon has expired" };
    }
    if (Number(coupon.maxUses ?? 0) > 0 && Number(coupon.usedCount ?? 0) >= Number(coupon.maxUses)) {
      return { error: "This coupon has been fully used" };
    }
    if (subtotal < Number(coupon.minSubtotal ?? 0)) {
      return { error: `Requires a subtotal of at least EGP ${Number(coupon.minSubtotal).toFixed(0)}` };
    }
    const discount =
      coupon.kind === "percent"
        ? Math.min(subtotal, Math.round((subtotal * Math.min(90, Number(coupon.value))) / 100 * 100) / 100)
        : Math.min(subtotal, Number(coupon.value));
    return { quote: { code: normalized, kind: coupon.kind as "percent" | "fixed", value: Number(coupon.value), discount } };
  } catch {
    return { error: "Could not validate coupon" };
  }
}

/** Atomically consume one use. Returns false if exhausted/expired since quote. */
export async function consumeCoupon(code: string): Promise<boolean> {  try {
    await connectDB();
    const res = await Coupon.updateOne(
      {
        code,
        active: true,
        $and: [
          { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
          { $or: [{ maxUses: 0 }, { maxUses: { $exists: false } }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }] },
        ],
      },
      { $inc: { usedCount: 1 } }
    );
    return (res.modifiedCount ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Release one use (order write failed after consume). Best-effort. */
export async function releaseCoupon(code: string): Promise<void> {
  try {
    await connectDB();
    await Coupon.updateOne({ code }, { $inc: { usedCount: -1 } });
  } catch {
    // best effort
  }
}

export { normalizeCode as normalizeCouponCode };

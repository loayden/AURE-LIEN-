import connectDB, { hasConfiguredMongoUri } from "@/lib/connectDB";
import LoyaltyLedger from "@/models/LoyaltyLedger";
import { getOrdersJson } from "@/lib/orderStorage";
import { pointsForTotal } from "@/lib/loyalty";

/** Lifetime earned points from real orders. */
export async function lifetimePoints(userId: string): Promise<number> {
  const orders = await getOrdersJson().catch(() => []);
  return orders
    .filter((o) => o.userId === userId)
    .reduce((sum, o) => sum + pointsForTotal(Number(o.totalPrice ?? o.total ?? 0)), 0);
}

/** Points already spent/granted via ledger. */
export async function ledgerBalance(userId: string): Promise<number> {
  if (!hasConfiguredMongoUri()) return 0;
  try {
    await connectDB();
    const rows = await LoyaltyLedger.find({ userId }).lean() as Array<{ points?: number }>;
    return rows.reduce((sum, r) => sum + Number(r.points ?? 0), 0);
  } catch {
    return 0;
  }
}

/** Spendable = lifetime earned + ledger adjustments (bonus positive, redeem negative). */
export async function availablePoints(userId: string): Promise<number> {
  const [lifetime, adjustments] = await Promise.all([lifetimePoints(userId), ledgerBalance(userId)]);
  return Math.max(0, lifetime + adjustments);
}

/** Record a redemption (negative points). Idempotent per orderId. */
export async function recordRedemption(userId: string, orderId: string, points: number): Promise<boolean> {  if (!hasConfiguredMongoUri() || points <= 0) return points <= 0;
  try {
    await connectDB();
    await LoyaltyLedger.create({
      _id: `redeem-${orderId}`,
      userId,
      orderId,
      points: -Math.abs(Math.floor(points)),
      kind: "redeem",
    });
    return true;
  } catch {
    return false;
  }
}

/** Grant bonus points (referrals). */
export async function grantBonus(userId: string, points: number, note: string): Promise<void> {
  if (!hasConfiguredMongoUri() || points <= 0) return;
  try {
    await connectDB();
    await LoyaltyLedger.create({
      _id: `bonus-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId,
      orderId: "",
      points: Math.abs(Math.floor(points)),
      kind: "bonus",
      note: String(note).slice(0, 200),
    });
  } catch {
    // best effort
  }
}

/** Remove a redemption (order write failed after ledger). Best-effort. */
export async function voidRedemption(orderId: string): Promise<void> {
  if (!hasConfiguredMongoUri() || !orderId) return;
  try {
    await connectDB();
    await LoyaltyLedger.deleteOne({ _id: `redeem-${orderId}` });
  } catch {
    // best effort
  }
}

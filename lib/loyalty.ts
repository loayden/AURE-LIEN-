/**
 * Loyalty points derived from real orders. 1 point per 100 EGP spent (paid/COD-pending counts).
 */
export function pointsForTotal(totalEgp: number): number {
  const total = Number(totalEgp ?? 0);
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.floor(total / 100);
}

export function loyaltyTier(points: number): "Bronze" | "Silver" | "Gold" {
  if (points >= 500) return "Gold";
  if (points >= 150) return "Silver";
  return "Bronze";
}

export const LOYALTY_REDEEM_STEP = 100;
export const LOYALTY_REDEEM_VALUE_EGP = 10;
export const REFERRAL_BONUS_POINTS = 200;

export function redeemValueForPoints(points: number): number {
  const steps = Math.floor(Math.max(0, Number(points) || 0) / LOYALTY_REDEEM_STEP);
  return steps * LOYALTY_REDEEM_VALUE_EGP;
}

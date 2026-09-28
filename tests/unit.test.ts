/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { paginateArray, parsePaginationParams } from "@/lib/pagination";
import { convertPrice, formatConvertedPrice, getSupportedCurrencies } from "@/lib/currency";
import { loyaltyTier, pointsForTotal, redeemValueForPoints } from "@/lib/loyalty";
import { cartItemSchema, loginSchema, saveOrderSchema, signupSchema } from "@/lib/validate";
import { normalizeCouponCode } from "@/lib/coupons";

describe("pagination", () => {
  it("paginates arrays with metadata", () => {
    const items = Array.from({ length: 79 }, (_, i) => i);
    const { data, pagination } = paginateArray(items, 2, 24);
    expect(data).toHaveLength(24);
    expect(data[0]).toBe(24);
    expect(pagination).toEqual({ page: 2, limit: 24, total: 79, totalPages: 4 });
  });

  it("clamps out-of-range pages", () => {
    const { pagination } = paginateArray([1, 2, 3], 99, 24);
    expect(pagination.page).toBe(1);
  });

  it("parses query params with safe defaults", () => {
    const params = parsePaginationParams(new URL("https://x.test/?page=2&limit=5"));
    expect(params).toEqual({ page: 2, limit: 5 });
    const bad = parsePaginationParams(new URL("https://x.test/?page=-3&limit=9999"));
    expect(bad.page).toBe(1);
    expect(bad.limit).toBeLessThanOrEqual(100);
  });
});

describe("currency", () => {
  it("converts from EGP base", () => {
    expect(convertPrice(4800, "USD")).toBeCloseTo(100, 0);
    expect(convertPrice(100, "EGP")).toBe(100);
    expect(convertPrice(100, "XXX")).toBe(100);
  });

  it("formats with currency code", () => {
    expect(formatConvertedPrice(100, "EGP")).toContain("EGP");
    expect(getSupportedCurrencies()).toContain("EGP");
  });
});

describe("loyalty", () => {
  it("earns 1 point per 100 EGP", () => {
    expect(pointsForTotal(1575)).toBe(15);
    expect(pointsForTotal(0)).toBe(0);
    expect(pointsForTotal(-5)).toBe(0);
  });

  it("tiers correctly", () => {
    expect(loyaltyTier(0)).toBe("Bronze");
    expect(loyaltyTier(150)).toBe("Silver");
    expect(loyaltyTier(500)).toBe("Gold");
  });

  it("redeems in 100-point steps", () => {
    expect(redeemValueForPoints(250)).toBe(20);
    expect(redeemValueForPoints(99)).toBe(0);
  });
});

describe("validation schemas", () => {
  it("accepts valid cart items, rejects junk", () => {
    expect(cartItemSchema.safeParse({ productId: "p-1", quantity: 2 }).success).toBe(true);
    expect(cartItemSchema.safeParse({ productId: "", quantity: 0 }).success).toBe(false);
    expect(cartItemSchema.safeParse({ productId: "p-1", quantity: 100 }).success).toBe(false);
  });

  it("requires email-shaped login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });

  it("enforces signup rules", () => {
    const good = { name: "N", email: "a@b.com", password: "long enough phrase", confirmPassword: "long enough phrase" };
    expect(signupSchema.safeParse(good).success).toBe(true);
    expect(signupSchema.safeParse({ ...good, password: "short" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...good, confirmPassword: "mismatch" }).success).toBe(false);
  });

  it("requires order essentials", () => {
    const good = {
      items: [{ productId: "p-1", quantity: 1 }],
      total: 100,
      customerInfo: { email: "a@b.com", name: "N", address: "A" },
    };
    expect(saveOrderSchema.safeParse(good).success).toBe(true);
    expect(saveOrderSchema.safeParse({ ...good, items: [] }).success).toBe(false);
    expect(saveOrderSchema.safeParse({ ...good, customerInfo: { email: "bad", address: "A" } }).success).toBe(false);
  });
});

describe("coupons", () => {
  it("normalizes codes safely", () => {
    expect(normalizeCouponCode("  welcome-10!! ")).toBe("WELCOME-10");
    expect(normalizeCouponCode("")).toBe("");
  });
});

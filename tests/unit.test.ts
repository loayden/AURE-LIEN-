/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { paginateArray, parsePaginationParams } from "@/lib/pagination";
import { convertPrice, formatConvertedPrice, getSupportedCurrencies } from "@/lib/currency";
import { loyaltyTier, pointsForTotal, redeemValueForPoints } from "@/lib/loyalty";

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

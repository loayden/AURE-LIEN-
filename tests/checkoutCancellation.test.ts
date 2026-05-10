import assert from "node:assert/strict";
import test from "node:test";

import { cancelCheckoutState } from "@/lib/checkoutCancellation";

test("checkout cancellation clears the user's draft without touching other drafts", () => {
  const result = cancelCheckoutState({
    userId: "user-1",
    drafts: {
      "user-1": { items: [], form: {}, updatedAt: "2026-05-09T00:00:00.000Z" },
      "user-2": { items: [], form: {}, updatedAt: "2026-05-09T00:00:00.000Z" },
    },
    orders: [],
  });

  assert.equal(result.draftRemoved, true);
  assert.deepEqual(Object.keys(result.drafts), ["user-2"]);
});

test("checkout cancellation removes only the user's unpaid pending card order", () => {
  const result = cancelCheckoutState({
    userId: "user-1",
    orderId: "order-card",
    drafts: {},
    orders: [
      {
        _id: "order-card",
        userId: "user-1",
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: "card",
      },
      {
        _id: "order-cod",
        userId: "user-1",
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "cash_on_delivery",
      },
      {
        _id: "order-other-user",
        userId: "user-2",
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: "card",
      },
    ],
  });

  assert.equal(result.orderRemoved, true);
  assert.deepEqual(
    result.orders.map((order) => String(order._id)),
    ["order-cod", "order-other-user"]
  );
});

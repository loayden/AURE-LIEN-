type CheckoutDraft = {
  items?: unknown[];
  form?: Record<string, unknown>;
  updatedAt?: string;
};

export type CheckoutDrafts = Record<string, CheckoutDraft>;

export type CheckoutOrder = {
  _id?: string;
  id?: string;
  userId?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  [key: string]: unknown;
};

type CancelCheckoutInput = {
  userId: string;
  orderId?: string | null;
  drafts: CheckoutDrafts;
  orders: CheckoutOrder[];
};

export function canCancelCheckoutOrder(order: CheckoutOrder, userId: string, orderId?: string | null) {
  const resolvedOrderId = String(order._id ?? order.id ?? "");
  const requestedOrderId = String(orderId ?? "");
  if (requestedOrderId && resolvedOrderId !== requestedOrderId) return false;
  if (String(order.userId ?? "") !== userId) return false;

  return (
    order.status === "pending" &&
    order.paymentStatus !== "paid" &&
    order.paymentMethod === "card"
  );
}

export function cancelCheckoutState({ userId, orderId, drafts, orders }: CancelCheckoutInput) {
  const nextDrafts = { ...drafts };
  const draftRemoved = Object.prototype.hasOwnProperty.call(nextDrafts, userId);
  delete nextDrafts[userId];

  let orderRemoved = false;
  const nextOrders = orders.filter((order) => {
    if (!canCancelCheckoutOrder(order, userId, orderId)) return true;
    orderRemoved = true;
    return false;
  });

  return {
    drafts: nextDrafts,
    orders: nextOrders,
    draftRemoved,
    orderRemoved,
  };
}

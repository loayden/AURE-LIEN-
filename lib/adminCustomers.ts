import type { UserRecord } from "@/lib/usersJson";

export type AdminOrderCustomer = {
  dataCleared?: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type AdminOrderLike = {
  _id?: string;
  id?: string;
  customerDataCleared?: boolean;
  userId?: string;
  customer?: AdminOrderCustomer;
  total?: number;
  totalPrice?: number;
  createdAt?: string;
};

export type AdminCustomerSummary = {
  _id: string;
  accountId: string | null;
  name: string;
  email: string;
  createdAt: string;
  lastOrderAt: string;
  orders: number;
  totalSpent: number;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  accountIntent: "buyer" | "partner" | "both";
  deviceAccountWarning: string;
  source: "account" | "guest";
};

export type AdminCustomerIndex = {
  customers: AdminCustomerSummary[];
  byAccountId: Map<string, AdminCustomerSummary>;
  byEmail: Map<string, AdminCustomerSummary>;
  byOrderId: Map<string, AdminCustomerSummary>;
};

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function isCustomerDataCleared(order: AdminOrderLike): boolean {
  return Boolean(order.customerDataCleared || order.customer?.dataCleared);
}

function normalizeEmail(value: unknown): string {
  return cleanString(value).toLowerCase();
}

function toIsoDate(value: unknown): string {
  const date = value ? new Date(String(value)) : null;
  if (date && !Number.isNaN(date.getTime())) {
    return date.toISOString();
  }
  return new Date().toISOString();
}

function earlierDate(a: string, b: string): string {
  return new Date(a).getTime() <= new Date(b).getTime() ? a : b;
}

function laterDate(a: string, b: string): string {
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

function isPlaceholderName(value: string): boolean {
  return (
    !value ||
    value === "—" ||
    value.toLowerCase().startsWith("guest") ||
    value.toLowerCase().startsWith("order ")
  );
}

export function buildAddress(parts: Array<string | undefined>): string {
  return parts.map((part) => cleanString(part)).filter(Boolean).join(", ");
}

function resolveCustomerName(
  customer: AdminOrderCustomer | undefined,
  email: string,
  orderId: string
): string {
  const explicitName = cleanString(customer?.name);
  if (explicitName) return explicitName;

  const combinedName = [customer?.firstName, customer?.lastName]
    .map((part) => cleanString(part))
    .filter(Boolean)
    .join(" ");
  if (combinedName) return combinedName;

  if (email) return `Guest (${email})`;
  return `Order ${orderId.slice(0, 8)}`;
}

function createAccountSummary(user: UserRecord): AdminCustomerSummary {
  return {
    _id: user.id,
    accountId: user.id,
    name: cleanString(user.name) || cleanString(user.email) || "—",
    email: cleanString(user.email),
    createdAt: toIsoDate(user.createdAt),
    lastOrderAt: "",
    orders: 0,
    totalSpent: 0,
    phone: cleanString(user.phone),
    address: buildAddress([user.address, user.apartment]),
    city: cleanString(user.city),
    postalCode: cleanString(user.postalCode),
    country: cleanString(user.country),
    accountIntent: user.accountIntent ?? "buyer",
    deviceAccountWarning: cleanString(user.deviceAccountWarning),
    source: "account",
  };
}

function createGuestSummary(orderId: string, email: string): AdminCustomerSummary {
  return {
    _id: email ? `order-${email}` : `guest-${orderId}`,
    accountId: null,
    name: email ? `Guest (${email})` : `Order ${orderId.slice(0, 8)}`,
    email,
    createdAt: "",
    lastOrderAt: "",
    orders: 0,
    totalSpent: 0,
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    accountIntent: "buyer",
    deviceAccountWarning: "",
    source: "guest",
  };
}

function hydrateSummaryFromSources(
  summary: AdminCustomerSummary,
  user: UserRecord | undefined,
  order: AdminOrderLike,
  orderId: string,
  orderEmail: string
) {
  const customer = order.customer;

  if (user) {
    summary._id = user.id;
    summary.accountId = user.id;
    summary.source = "account";
    summary.email = cleanString(user.email) || summary.email || orderEmail;
    summary.createdAt = toIsoDate(user.createdAt);
    summary.accountIntent = user.accountIntent ?? "buyer";
    summary.deviceAccountWarning = cleanString(user.deviceAccountWarning);
    if (cleanString(user.name)) {
      summary.name = cleanString(user.name);
    }
  } else if (!summary._id) {
    summary._id = orderEmail ? `order-${orderEmail}` : `guest-${orderId}`;
  }

  const fallbackName = resolveCustomerName(customer, summary.email || orderEmail, orderId);
  if (isPlaceholderName(summary.name) && fallbackName) {
    summary.name = fallbackName;
  }

  summary.phone ||= cleanString(user?.phone) || cleanString(customer?.phone);
  summary.address ||= buildAddress([
    cleanString(user?.address) || customer?.address,
    cleanString(user?.apartment) || customer?.apartment,
  ]);
  summary.city ||= cleanString(user?.city) || cleanString(customer?.city);
  summary.postalCode ||= cleanString(user?.postalCode) || cleanString(customer?.postalCode);
  summary.country ||= cleanString(user?.country) || cleanString(customer?.country);
  summary.email ||= orderEmail;
}

export function buildAdminCustomerIndex(
  users: UserRecord[],
  orders: AdminOrderLike[]
): AdminCustomerIndex {
  const byKey = new Map<string, AdminCustomerSummary>();
  const byAccountId = new Map<string, AdminCustomerSummary>();
  const byEmail = new Map<string, AdminCustomerSummary>();
  const byOrderId = new Map<string, AdminCustomerSummary>();

  const usersById = new Map<string, UserRecord>();
  const usersByEmail = new Map<string, UserRecord>();

  for (const user of users) {
    if (user.role === "admin") {
      continue;
    }

    usersById.set(user.id, user);

    const email = normalizeEmail(user.email);
    if (email) {
      usersByEmail.set(email, user);
    }

    const key = email ? `email:${email}` : `account:${user.id}`;
    const summary = createAccountSummary(user);
    byKey.set(key, summary);
    byAccountId.set(user.id, summary);
    if (email) {
      byEmail.set(email, summary);
    }
  }

  for (const order of orders) {
    if (isCustomerDataCleared(order)) {
      continue;
    }

    const orderId = cleanString(order._id || order.id) || `guest-${byOrderId.size + 1}`;
    const userId = cleanString(order.userId);
    const userById = userId ? usersById.get(userId) : undefined;
    const orderEmail = normalizeEmail(order.customer?.email);
    const userByEmail = orderEmail ? usersByEmail.get(orderEmail) : undefined;
    const matchedUser = userById ?? userByEmail;

    const key = matchedUser
      ? normalizeEmail(matchedUser.email)
        ? `email:${normalizeEmail(matchedUser.email)}`
        : `account:${matchedUser.id}`
      : orderEmail
        ? `email:${orderEmail}`
        : `guest:${orderId}`;

    let summary = byKey.get(key);
    if (!summary) {
      summary = createGuestSummary(orderId, orderEmail);
      byKey.set(key, summary);
    }

    hydrateSummaryFromSources(summary, matchedUser, order, orderId, orderEmail);

    const orderDate = toIsoDate(order.createdAt);
    summary.lastOrderAt = summary.lastOrderAt
      ? laterDate(summary.lastOrderAt, orderDate)
      : orderDate;
    summary.createdAt = summary.createdAt
      ? summary.source === "account"
        ? summary.createdAt
        : earlierDate(summary.createdAt, orderDate)
      : orderDate;
    summary.orders += 1;
    summary.totalSpent += Number(order.totalPrice ?? order.total ?? 0) || 0;

    if (summary.accountId) {
      byAccountId.set(summary.accountId, summary);
    }
    if (summary.email) {
      byEmail.set(normalizeEmail(summary.email), summary);
    }
    byOrderId.set(orderId, summary);
  }

  const customers = Array.from(byKey.values()).sort((a, b) => {
    const aTime = new Date(a.lastOrderAt || a.createdAt).getTime();
    const bTime = new Date(b.lastOrderAt || b.createdAt).getTime();
    return bTime - aTime;
  });

  return {
    customers,
    byAccountId,
    byEmail,
    byOrderId,
  };
}

export function getCustomerForOrder(
  index: AdminCustomerIndex,
  order: AdminOrderLike
): AdminCustomerSummary | null {
  if (isCustomerDataCleared(order)) {
    return null;
  }

  const orderId = cleanString(order._id || order.id);
  if (orderId && index.byOrderId.has(orderId)) {
    return index.byOrderId.get(orderId) ?? null;
  }

  const userId = cleanString(order.userId);
  if (userId && index.byAccountId.has(userId)) {
    return index.byAccountId.get(userId) ?? null;
  }

  const email = normalizeEmail(order.customer?.email);
  if (email && index.byEmail.has(email)) {
    return index.byEmail.get(email) ?? null;
  }

  return null;
}

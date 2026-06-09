import type { BoutiqueApplication, BoutiquePayoutProfile } from "@/lib/boutiqueApplications";
import { getPayoutProfileCompleteness, maskPayoutValue } from "@/lib/boutiqueApplications";
import type { PartnerProductDraft } from "@/lib/partnerProducts";

export type PartnerWalletOrderLine = {
  orderId: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  payoutStatus: "pending" | "available" | "paid";
  productId: string;
  productName: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  grossAmount: number;
  commissionAmount: number;
  estimatedPayout: number;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
};

export type PartnerWalletSummary = {
  orders: number;
  items: number;
  grossSales: number;
  pending: number;
  available: number;
  paid: number;
  commission: number;
  refunds: number;
  paymentFees: number;
  payoutProfileStatus: "missing" | "incomplete" | "complete";
};

export type PartnerWallet = {
  application: {
    _id: string;
    boutiqueName: string;
    ownerName: string;
    phone: string;
    planName: string;
    commissionRate: number;
    monthlyFee: number;
    trialDays: number;
  };
  payoutProfile?: BoutiquePayoutProfile;
  payoutPreview: {
    method: string;
    destination: string;
    status: PartnerWalletSummary["payoutProfileStatus"];
  };
  summary: PartnerWalletSummary;
  lines: PartnerWalletOrderLine[];
};

const AVAILABLE_ORDER_STATUSES = new Set(["completed", "delivered", "fulfilled"]);
const AVAILABLE_PAYMENT_STATUSES = new Set(["paid", "settled", "completed"]);

function cleanString(value: unknown): string {
  return String(value ?? "").trim();
}

function safeIsoDate(value: unknown): string {
  const date = value instanceof Date
    ? value
    : typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : new Date();

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function safeDateTime(value: unknown): number {
  const date = value instanceof Date
    ? value
    : typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : null;

  const time = date?.getTime();
  return typeof time === "number" && Number.isFinite(time) ? time : 0;
}

function getOrderItems(order: any) {
  const items = Array.isArray(order?.items) && order.items.length
    ? order.items
    : Array.isArray(order?.products)
      ? order.products
      : [];

  return items.map((item: any) => ({
    productId: cleanString(item.productId ?? item._id),
    productName: cleanString(item.name) || "Partner product",
    quantity: Math.max(1, Math.floor(Number(item.quantity ?? 1))),
    price: Math.max(0, Number(item.price ?? 0)),
    size: item.size ?? null,
    color: item.color ?? null,
  }));
}

function getPayoutStatus(order: any): PartnerWalletOrderLine["payoutStatus"] {
  const payoutStatus = cleanString(order?.partnerPayoutStatus ?? order?.payoutStatus).toLowerCase();
  if (payoutStatus === "paid") return "paid";

  const orderStatus = cleanString(order?.status).toLowerCase();
  const paymentStatus = cleanString(order?.paymentStatus).toLowerCase();
  if (AVAILABLE_ORDER_STATUSES.has(orderStatus) || AVAILABLE_PAYMENT_STATUSES.has(paymentStatus)) {
    return "available";
  }

  return "pending";
}

function getCustomer(order: any): PartnerWalletOrderLine["customer"] {
  const customer = order?.customer ?? order?.user ?? {};
  const name = cleanString(customer.name) || [customer.firstName, customer.lastName].map(cleanString).filter(Boolean).join(" ");
  return {
    name: name || "Customer",
    phone: cleanString(customer.phone),
    city: cleanString(customer.city),
    address: [customer.address, customer.apartment].map(cleanString).filter(Boolean).join(", "),
  };
}

export function getPayoutDestination(profile?: BoutiquePayoutProfile): string {
  if (!profile?.method) return "Add payout details";
  if (profile.method === "bank_account") {
    return `${profile.bankName || "Bank"} ${maskPayoutValue(profile.iban)}`;
  }
  if (profile.method === "mobile_wallet") {
    return `Wallet ${maskPayoutValue(profile.mobileWalletPhone)}`;
  }
  return `Paymob ${maskPayoutValue(profile.paymobMerchantId)}`;
}

export function buildPartnerWallet(input: {
  application: BoutiqueApplication;
  products: PartnerProductDraft[];
  orders: any[];
}): PartnerWallet {
  const { application, products, orders } = input;
  const liveProducts = products.filter((product) => product.status === "approved");
  const productById = new Map(
    liveProducts.flatMap((product) => [
      [product.productId, product],
      [product._id, product],
    ])
  );
  const commissionRate = Math.max(0, Number(application.commissionRate ?? 0));
  const lines: PartnerWalletOrderLine[] = [];

  for (const order of orders) {
    const payoutStatus = getPayoutStatus(order);

    for (const item of getOrderItems(order)) {
      const partnerProduct = productById.get(item.productId);
      if (!partnerProduct) continue;

      const grossAmount = item.price * item.quantity;
      const commissionAmount = Math.round((grossAmount * commissionRate) / 100);
      const estimatedPayout = Math.max(0, grossAmount - commissionAmount);

      lines.push({
        orderId: cleanString(order?._id ?? order?.id),
        createdAt: safeIsoDate(order?.createdAt),
        status: cleanString(order?.status) || "pending",
        paymentStatus: cleanString(order?.paymentStatus) || "pending",
        paymentMethod: cleanString(order?.paymentMethod),
        payoutStatus,
        productId: partnerProduct.productId,
        productName: item.productName || partnerProduct.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        grossAmount,
        commissionAmount,
        estimatedPayout,
        customer: getCustomer(order),
      });
    }
  }

  const uniqueOrderIds = new Set(lines.map((line) => line.orderId));
  const summary = lines.reduce<PartnerWalletSummary>(
    (current, line) => {
      current.items += line.quantity;
      current.grossSales += line.grossAmount;
      current.commission += line.commissionAmount;
      if (line.payoutStatus === "paid") {
        current.paid += line.estimatedPayout;
      } else if (line.payoutStatus === "available") {
        current.available += line.estimatedPayout;
      } else {
        current.pending += line.estimatedPayout;
      }
      return current;
    },
    {
      orders: uniqueOrderIds.size,
      items: 0,
      grossSales: 0,
      pending: 0,
      available: 0,
      paid: 0,
      commission: 0,
      refunds: 0,
      paymentFees: 0,
      payoutProfileStatus: getPayoutProfileCompleteness(application.payoutProfile),
    }
  );

  summary.orders = uniqueOrderIds.size;

  return {
    application: {
      _id: application._id,
      boutiqueName: application.boutiqueName,
      ownerName: application.ownerName,
      phone: application.phone,
      planName: application.planName,
      commissionRate,
      monthlyFee: application.monthlyFee,
      trialDays: application.trialDays,
    },
    payoutProfile: application.payoutProfile,
    payoutPreview: {
      method: application.payoutProfile?.method ?? "missing",
      destination: getPayoutDestination(application.payoutProfile),
      status: summary.payoutProfileStatus,
    },
    summary,
    lines: lines.sort((a, b) => safeDateTime(b.createdAt) - safeDateTime(a.createdAt)),
  };
}

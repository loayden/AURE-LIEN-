import { sendEmailAsync } from "@/lib/email/sender";
import { getOrderConfirmationEmailHtml, type OrderProduct } from "@/lib/email/templates/order-confirmation";
import {
  getPartnerApplicationEmailHtml,
  getPartnerProductDecisionEmailHtml,
  getPartnerProductSubmittedEmailHtml,
} from "@/lib/email/templates/transactional";
import {
  formatDeliveryWindow,
  PARTNER_APPLICATION_REVIEW_WINDOW,
  PARTNER_PRODUCT_REVIEW_WINDOW,
} from "@/lib/notificationCopy";
import { sendWhatsAppMessageAsync } from "@/lib/whatsapp";
import type { BoutiqueApplication } from "@/lib/boutiqueApplications";
import type { PartnerProductDraft } from "@/lib/partnerProducts";

type NotifyOrder = {
  _id?: string;
  id?: string;
  total?: number;
  totalPrice?: number;
  customer?: {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    apartment?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  items?: OrderProduct[];
  products?: OrderProduct[];
};

function compactText(parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join("\n");
}

function getCustomerName(customer?: NotifyOrder["customer"]): string {
  const fullName = String(customer?.name ?? "").trim();
  if (fullName) return fullName;
  return [customer?.firstName, customer?.lastName].map((part) => String(part ?? "").trim()).filter(Boolean).join(" ") || "BOUT customer";
}

function getShippingAddress(customer?: NotifyOrder["customer"]): string {
  return [
    customer?.address,
    customer?.apartment,
    customer?.city,
    customer?.postalCode,
    customer?.country,
  ].map((part) => String(part ?? "").trim()).filter(Boolean).join(", ");
}

function normalizeOrderProducts(order: NotifyOrder): OrderProduct[] {
  const source = Array.isArray(order.products) && order.products.length ? order.products : order.items ?? [];
  return source.map((item: any) => ({
    name: String(item?.name ?? "BOUT item"),
    price: Number(item?.price ?? 0),
    quantity: Number(item?.quantity ?? 1),
  }));
}

function notifyEmail(options: { to?: string; subject: string; html: string; text?: string }) {
  const to = String(options.to ?? "").trim();
  if (!to) return;
  sendEmailAsync({ to, subject: options.subject, html: options.html, text: options.text });
}

export function notifyOrderPlaced(order: NotifyOrder): void {
  const customer = order.customer;
  const email = String(customer?.email ?? "").trim();
  const phone = String(customer?.phone ?? "").trim();
  const orderId = String(order._id ?? order.id ?? "");
  const customerName = getCustomerName(customer);
  const deliveryWindow = formatDeliveryWindow(customer?.city);
  const shippingAddress = getShippingAddress(customer);
  const totalPrice = Number(order.totalPrice ?? order.total ?? 0);
  const products = normalizeOrderProducts(order);

  notifyEmail({
    to: email,
    subject: `BOUT order received · ${orderId}`,
    html: getOrderConfirmationEmailHtml({
      orderId,
      customerName,
      customerEmail: email,
      products,
      totalPrice,
      shippingAddress,
      deliveryWindow,
    }),
  });

  sendWhatsAppMessageAsync({
    to: phone,
    body: compactText([
      `BOUT: Thank you ${customerName}.`,
      `We received your order ${orderId}.`,
      `Estimated delivery: ${deliveryWindow}.`,
      shippingAddress ? `Delivery address: ${shippingAddress}.` : undefined,
      "We will contact you if we need to confirm any detail.",
    ]),
  });
}

export function notifyPartnerApplicationReceived(application: BoutiqueApplication): void {
  notifyEmail({
    to: application.email,
    subject: `BOUT received ${application.boutiqueName}`,
    html: getPartnerApplicationEmailHtml({
      ownerName: application.ownerName,
      boutiqueName: application.boutiqueName,
      applicationId: application._id,
      planName: application.planName,
      trialDays: application.trialDays,
      reviewWindow: PARTNER_APPLICATION_REVIEW_WINDOW,
    }),
  });

  sendWhatsAppMessageAsync({
    to: application.phone,
    body: compactText([
      `BOUT: Thank you ${application.ownerName}.`,
      `We received the partnership request for ${application.boutiqueName}.`,
      `Application ID: ${application._id}.`,
      `Review time: ${PARTNER_APPLICATION_REVIEW_WINDOW}.`,
      "After review, you can continue adding products from the partner product desk.",
    ]),
  });
}

export function notifyPartnerProductSubmitted(product: PartnerProductDraft): void {
  notifyEmail({
    to: product.partnerEmail,
    subject: `BOUT product approval · ${product.name}`,
    html: getPartnerProductSubmittedEmailHtml({
      partnerName: product.partnerName,
      boutiqueName: product.boutiqueName,
      productName: product.name,
      reviewWindow: PARTNER_PRODUCT_REVIEW_WINDOW,
    }),
  });

  sendWhatsAppMessageAsync({
    to: product.phone,
    body: compactText([
      `BOUT: ${product.name} was sent for admin approval.`,
      `Boutique: ${product.boutiqueName}.`,
      `Expected review time: ${PARTNER_PRODUCT_REVIEW_WINDOW}.`,
      "You will receive another message after approval or rejection.",
    ]),
  });
}

export function notifyPartnerProductReviewed(product: PartnerProductDraft): void {
  const liveUrl = product.status === "approved"
    ? `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/product/${encodeURIComponent(product.productId)}`
    : undefined;

  notifyEmail({
    to: product.partnerEmail,
    subject: product.status === "approved"
      ? `BOUT approved ${product.name}`
      : `BOUT product review update · ${product.name}`,
    html: getPartnerProductDecisionEmailHtml({
      partnerName: product.partnerName,
      productName: product.name,
      status: product.status === "approved" ? "approved" : "rejected",
      reviewNote: product.reviewNote,
      liveUrl,
    }),
  });

  sendWhatsAppMessageAsync({
    to: product.phone,
    body: compactText([
      `BOUT: Product review update for ${product.name}.`,
      product.status === "approved"
        ? "Status: approved and live in Shop."
        : "Status: needs changes before publishing.",
      product.reviewNote ? `Admin note: ${product.reviewNote}` : undefined,
      liveUrl ? `Live product: ${liveUrl}` : "Open your partner product desk for details.",
    ]),
  });
}

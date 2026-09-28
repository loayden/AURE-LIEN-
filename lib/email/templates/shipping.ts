import { SITE_URL } from "../sender";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function shell(title: string, heading: string, body: string): string {
  return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
<tr><td align="center" style="padding:40px 24px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(198,167,94,0.3);">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Maison Aurelia</h1>
<p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;color:#B0B0B0;text-transform:uppercase;">${heading}</p>
</td></tr>
<tr><td style="padding:32px 0;">${body}</td></tr>
<tr><td style="padding-top:24px;border-top:1px solid rgba(198,167,94,0.2);">
<p style="margin:0;font-size:12px;color:#B0B0B0;">Maison Aurelia — Crafted in silence. Designed for presence.</p>
</td></tr>
</table></td></tr></table></body></html>`.trim();
}

export function getOrderShippedEmailHtml(data: { orderId: string; customerName: string }): string {
  return shell(
    "Order shipped",
    "On its way",
    `<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#EAE6DF;">Your order <strong style="color:#C6A75E;">${escapeHtml(data.orderId)}</strong> has shipped and is on its way to you.</p>
     <p style="margin:24px 0 0;"><a href="${SITE_URL}/orders" style="display:inline-block;padding:14px 32px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Track your order</a></p>`
  );
}

export function getOrderDeliveredEmailHtml(data: { orderId: string; customerName: string }): string {
  return shell(
    "Order delivered",
    "Delivered",
    `<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
     <p style="margin:0;font-size:15px;line-height:1.7;color:#EAE6DF;">Your order <strong style="color:#C6A75E;">${escapeHtml(data.orderId)}</strong> was delivered. Enjoy — and thank you for choosing BOUT.</p>`
  );
}

export function getOrderRefundedEmailHtml(data: { orderId: string; customerName: string; amount?: number }): string {
  return shell(
    "Order refunded",
    "Refund issued",
    `<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
     <p style="margin:0;font-size:15px;line-height:1.7;color:#EAE6DF;">A refund has been issued for order <strong style="color:#C6A75E;">${escapeHtml(data.orderId)}</strong>${typeof data.amount === "number" ? ` (EGP ${data.amount.toFixed(2)})` : ""}. It should reach your original payment method within a few business days.</p>`
  );
}

export function getBackInStockEmailHtml(data: { productName: string; productId: string }): string {
  const url = `${SITE_URL}/product/${encodeURIComponent(data.productId)}`;
  return shell(
    "Back in stock",
    "Back in stock",
    `<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Good news — <strong style="color:#C6A75E;">${escapeHtml(data.productName)}</strong> is back in stock.</p>
     <p style="margin:24px 0 0;"><a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 32px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Shop now</a></p>`
  );
}

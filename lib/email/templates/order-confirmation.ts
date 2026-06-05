/**
 * Order Confirmation Email Template — Luxury styling
 * Triggered when a user completes a purchase.
 * Colors: #111111 background, #F5F1E9 text, #C6A75E accents
 */

import { SITE_URL } from "../sender";

export interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderConfirmationEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  products: OrderProduct[];
  totalPrice: number;
  shippingAddress?: string;
  deliveryWindow?: string;
}

export function getOrderConfirmationEmailHtml(data: OrderConfirmationEmailData): string {
  const { orderId, customerName, products, totalPrice, shippingAddress, deliveryWindow } = data;

  const productRows = products
    .map(
      (p) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(198,167,94,0.2);color:#F5F1E9;font-size:15px;">${escapeHtml(p.name)}</td>
      <td style="padding:12px 0;border-bottom:1px solid rgba(198,167,94,0.2);color:#F5F1E9;text-align:center;">${p.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid rgba(198,167,94,0.2);color:#C6A75E;text-align:right;">${formatPrice(p.price * p.quantity)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation — Maison Aurelia</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:40px;border-bottom:1px solid rgba(198,167,94,0.3);">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Maison Aurelia</h1>
              <p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;color:#B0B0B0;text-transform:uppercase;">Order Confirmation</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:48px 0 24px;">
              <p style="margin:0 0 24px;font-size:18px;line-height:1.6;color:#F5F1E9;">Dear ${escapeHtml(customerName)},</p>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.7;color:#EAE6DF;">
                Thank you for your order. We have received your request and will begin preparing your items with care.
              </p>
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;color:#B0B0B0;">Order ID</p>
              <p style="margin:0 0 24px;font-size:16px;color:#C6A75E;letter-spacing:0.05em;">${escapeHtml(orderId)}</p>
              ${shippingAddress ? `
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;color:#B0B0B0;">Shipping Address</p>
              <p style="margin:0 0 24px;font-size:15px;color:#EAE6DF;line-height:1.5;">${escapeHtml(shippingAddress)}</p>
              ` : ""}
              ${deliveryWindow ? `
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;color:#B0B0B0;">Estimated Delivery</p>
              <p style="margin:0 0 24px;font-size:15px;color:#EAE6DF;line-height:1.5;">${escapeHtml(deliveryWindow)}</p>
              ` : ""}
            </td>
          </tr>
          <!-- Products Table -->
          <tr>
            <td style="padding:0 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(198,167,94,0.3);">
                <thead>
                  <tr style="background:rgba(198,167,94,0.1);">
                    <th style="padding:14px 16px;text-align:left;font-size:11px;letter-spacing:0.15em;color:#C6A75E;text-transform:uppercase;">Product</th>
                    <th style="padding:14px 16px;text-align:center;font-size:11px;letter-spacing:0.15em;color:#C6A75E;text-transform:uppercase;">Qty</th>
                    <th style="padding:14px 16px;text-align:right;font-size:11px;letter-spacing:0.15em;color:#C6A75E;text-transform:uppercase;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
              <p style="margin:20px 0 0;font-size:18px;color:#F5F1E9;">Total: <strong style="color:#C6A75E;">${formatPrice(totalPrice)}</strong></p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:32px 0;">
              <a href="${SITE_URL}/orders" style="display:inline-block;padding:14px 32px;background-color:transparent;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Track Your Order</a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;border-top:1px solid rgba(198,167,94,0.2);">
              <p style="margin:0;font-size:12px;color:#B0B0B0;letter-spacing:0.1em;">Maison Aurelia — Crafted in silence. Designed for presence.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(amount);
}

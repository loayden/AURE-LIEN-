import { SITE_URL } from "../sender";

function escapeHtml(str: string): string {  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getAbandonedCartEmailHtml(data: {
  customerName: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  resumeUrl: string;
}): string {
  const rows = data.items
    .slice(0, 6)
    .map(
      (p) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(198,167,94,0.2);color:#F5F1E9;font-size:14px;">${escapeHtml(p.name)}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(198,167,94,0.2);color:#F5F1E9;text-align:center;">${p.quantity}</td>
    </tr>`
    )
    .join("");
  return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
<tr><td align="center" style="padding:40px 24px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(198,167,94,0.3);">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Maison Aurelia</h1>
<p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;color:#B0B0B0;text-transform:uppercase;">Your bag is waiting</p>
</td></tr>
<tr><td style="padding:32px 0;">
<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#EAE6DF;">You left a few pieces in your bag. They are reserved for a little longer.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
<p style="margin:28px 0 0;"><a href="${escapeHtml(data.resumeUrl)}" style="display:inline-block;padding:14px 32px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Resume checkout</a></p>
</td></tr>
</table></td></tr></table></body></html>`.trim();
}

export function getWinbackEmailHtml(data: { customerName: string }): string {
  return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
<tr><td align="center" style="padding:40px 24px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(198,167,94,0.3);">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Maison Aurelia</h1>
<p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;color:#B0B0B0;text-transform:uppercase;">We miss you</p>
</td></tr>
<tr><td style="padding:32px 0;">
<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#EAE6DF;">It has been a while. New pieces arrived since your last visit — crafted in silence, designed for presence.</p>
<p style="margin:28px 0 0;"><a href="${SITE_URL}/shop" style="display:inline-block;padding:14px 32px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Shop new arrivals</a></p>
</td></tr>
</table></td></tr></table></body></html>`.trim();
}

export function getBirthdayEmailHtml(data: { customerName: string }): string {
  return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
<tr><td align="center" style="padding:40px 24px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(198,167,94,0.3);">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Maison Aurelia</h1>
<p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;color:#B0B0B0;text-transform:uppercase;">Happy birthday</p>
</td></tr>
<tr><td style="padding:32px 0;">
<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#EAE6DF;">Happy birthday from Maison Aurelia. A little gift of loyalty points is waiting in your account.</p>
<p style="margin:28px 0 0;"><a href="${SITE_URL}/account" style="display:inline-block;padding:14px 32px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">View my points</a></p>
</td></tr>
</table></td></tr></table></body></html>`.trim();
}

export function getPriceDropEmailHtml(data: { customerName: string; productName: string; productId: string; oldPrice: number; newPrice: number }): string {
  return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
<tr><td align="center" style="padding:40px 24px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="padding-bottom:24px;border-bottom:1px solid rgba(198,167,94,0.3);">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Maison Aurelia</h1>
<p style="margin:8px 0 0;font-size:12px;letter-spacing:0.15em;color:#B0B0B0;text-transform:uppercase;">Price drop</p>
</td></tr>
<tr><td style="padding:32px 0;">
<p style="margin:0 0 16px;font-size:16px;color:#F5F1E9;">Dear ${escapeHtml(data.customerName)},</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#EAE6DF;">A piece in your wishlist just dropped: <strong>${escapeHtml(data.productName)}</strong> is now EGP ${data.newPrice.toFixed(2)} (was EGP ${data.oldPrice.toFixed(2)}).</p>
<p style="margin:28px 0 0;"><a href="${SITE_URL}/product/${encodeURIComponent(data.productId)}" style="display:inline-block;padding:14px 32px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">View piece</a></p>
</td></tr>
</table></td></tr></table></body></html>`.trim();
}

/**
 * Welcome Email Template — Luxury styling
 * Triggered when a user signs up.
 */

import { SITE_URL } from "../sender";

export interface WelcomeEmailData {
  userName: string;
}

export function getWelcomeEmailHtml(data: WelcomeEmailData): string {
  const { userName } = data;
  const displayName = userName?.trim() || "Valued Guest";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Luxury Bout</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:40px;border-bottom:1px solid rgba(198,167,94,0.3);">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.2em;color:#C6A75E;text-transform:uppercase;">Luxury Bout</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:48px 0 32px;">
              <p style="margin:0 0 24px;font-size:18px;line-height:1.6;color:#F5F1E9;">Dear ${escapeHtml(displayName)},</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#EAE6DF;">
                Hello and welcome to Luxury Bout. We are honoured to have you join our community of discerning individuals who appreciate refined craftsmanship and timeless design.
              </p>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.7;color:#EAE6DF;">
                Explore our curated collections of tailored menswear, footwear, and accessories — each piece crafted with precision and designed for those who value understated elegance.
              </p>
              <a href="${SITE_URL}" style="display:inline-block;padding:14px 32px;background-color:transparent;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">Discover the Collection</a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;border-top:1px solid rgba(198,167,94,0.2);">
              <p style="margin:0;font-size:12px;color:#B0B0B0;letter-spacing:0.1em;">Luxury Bout — Crafted in silence. Designed for presence.</p>
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
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

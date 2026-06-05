import { SITE_URL } from "../sender";

type BaseTemplateOptions = {
  title: string;
  eyebrow: string;
  greeting: string;
  intro: string;
  rows: Array<{ label: string; value: string }>;
  ctaHref?: string;
  ctaLabel?: string;
};

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function baseEmailTemplate(options: BaseTemplateOptions): string {
  const rows = options.rows
    .map(
      (row) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid rgba(198,167,94,0.18);font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#B0A48D;">${escapeHtml(row.label)}</td>
          <td style="padding:14px 0;border-bottom:1px solid rgba(198,167,94,0.18);font-size:15px;line-height:1.5;color:#F5F1E9;text-align:right;">${escapeHtml(row.value)}</td>
        </tr>
      `
    )
    .join("");

  const cta = options.ctaHref && options.ctaLabel
    ? `<a href="${escapeHtml(options.ctaHref)}" style="display:inline-block;margin-top:28px;padding:14px 28px;border:1px solid #C6A75E;color:#C6A75E;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">${escapeHtml(options.ctaLabel)}</a>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.title)} | BOUT</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#111111;">
    <tr>
      <td align="center" style="padding:44px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid rgba(198,167,94,0.30);">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:0.22em;color:#C6A75E;">BOUT</h1>
              <p style="margin:10px 0 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#B0B0B0;">${escapeHtml(options.eyebrow)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:38px 0 20px;">
              <p style="margin:0 0 20px;font-size:18px;line-height:1.6;color:#F5F1E9;">${escapeHtml(options.greeting)}</p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.8;color:#EAE6DF;">${escapeHtml(options.intro)}</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding-top:28px;border-top:1px solid rgba(198,167,94,0.18);">
              <p style="margin:0;font-size:12px;line-height:1.7;color:#B0B0B0;">BOUT support will contact you if any detail needs confirmation. Do not send card numbers or CVV by email or WhatsApp.</p>
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

export function getPartnerApplicationEmailHtml(data: {
  ownerName: string;
  boutiqueName: string;
  applicationId: string;
  planName: string;
  trialDays: number;
  reviewWindow: string;
}): string {
  return baseEmailTemplate({
    title: "Boutique application received",
    eyebrow: "Partner Application",
    greeting: `Hello ${data.ownerName || "Boutique partner"},`,
    intro: "Thank you for applying to sell on BOUT. We received your boutique request and the team will review your store details, location, payout profile, and product quality.",
    rows: [
      { label: "Boutique", value: data.boutiqueName },
      { label: "Application ID", value: data.applicationId },
      { label: "Plan", value: `${data.planName} · ${data.trialDays} day trial` },
      { label: "Review Time", value: data.reviewWindow },
      { label: "Next Step", value: "After review, continue by adding products from the partner product desk." },
    ],
    ctaHref: `${SITE_URL}/partners/products?applicationId=${encodeURIComponent(data.applicationId)}`,
    ctaLabel: "Open Product Desk",
  });
}

export function getPartnerProductSubmittedEmailHtml(data: {
  partnerName: string;
  boutiqueName: string;
  productName: string;
  reviewWindow: string;
}): string {
  return baseEmailTemplate({
    title: "Product submitted for approval",
    eyebrow: "Product Review",
    greeting: `Hello ${data.partnerName || "Boutique partner"},`,
    intro: "Thank you. Your product has been sent to BOUT admin review. It will not appear in Shop until it is approved.",
    rows: [
      { label: "Boutique", value: data.boutiqueName },
      { label: "Product", value: data.productName },
      { label: "Expected Review", value: data.reviewWindow },
      { label: "Status", value: "Pending admin approval" },
    ],
    ctaHref: `${SITE_URL}/partners/products`,
    ctaLabel: "View Product Desk",
  });
}

export function getPartnerProductDecisionEmailHtml(data: {
  partnerName: string;
  productName: string;
  status: "approved" | "rejected";
  reviewNote?: string;
  liveUrl?: string;
}): string {
  return baseEmailTemplate({
    title: data.status === "approved" ? "Product approved" : "Product review update",
    eyebrow: "Admin Review",
    greeting: `Hello ${data.partnerName || "Boutique partner"},`,
    intro: data.status === "approved"
      ? "Your product has been approved and published to the BOUT shop."
      : "Your product needs changes before it can be published to the BOUT shop.",
    rows: [
      { label: "Product", value: data.productName },
      { label: "Status", value: data.status === "approved" ? "Approved and live" : "Rejected for now" },
      { label: "Admin Note", value: data.reviewNote || "No note provided" },
    ],
    ctaHref: data.liveUrl || `${SITE_URL}/partners/products`,
    ctaLabel: data.status === "approved" ? "View Live Product" : "Open Product Desk",
  });
}

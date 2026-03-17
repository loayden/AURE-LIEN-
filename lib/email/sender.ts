/**
 * Luxury Ecommerce — Reusable Email Sender
 * Uses Nodemailer with async, non-blocking delivery.
 * Emails are sent asynchronously to avoid blocking API responses.
 */

import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SITE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

function getTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("[Email] EMAIL_USER or EMAIL_PASS not configured. Emails will not be sent.");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email. Runs asynchronously so it does not block the caller.
 * Failures are logged but do not throw.
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `"Maison Aurelia" <${EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}

/**
 * Send email in background. Does not await — fire and forget.
 * Use for welcome/order confirmation so API responds immediately.
 */
export function sendEmailAsync(options: SendEmailOptions): void {
  sendEmail(options).catch(() => {});
}

export { SITE_URL };

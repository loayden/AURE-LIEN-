/**
 * Welcome Email API
 * Call this when a user signs up to send the welcome email.
 * Protected: should only be called from trusted signup flow.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmailAsync } from "@/lib/email/sender";
import { getWelcomeEmailHtml } from "@/lib/email/templates/welcome";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userName = typeof name === "string" ? name.trim() : "";

    sendEmailAsync({
      to: email,
      subject: "Welcome to Maison Aurelia",
      html: getWelcomeEmailHtml({ userName }),
    });

    return NextResponse.json({ message: "Welcome email sent" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
  }
}

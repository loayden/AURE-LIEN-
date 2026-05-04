/**
 * Welcome Email API
 * Call this when a user signs up to send the welcome email.
 * Protected: should only be called from trusted signup flow.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmailAsync } from "@/lib/email/sender";
import { getWelcomeEmailHtml } from "@/lib/email/templates/welcome";
import { getAuthFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req);
    const internalToken = req.headers.get("x-internal-token");
    const expectedToken = process.env.INTERNAL_API_TOKEN;
    const allowedByToken = Boolean(expectedToken && internalToken === expectedToken);
    if (!allowedByToken && (!auth || auth.role !== "admin")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

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

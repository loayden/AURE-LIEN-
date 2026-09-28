import { NextResponse } from "next/server";
import { getPaymobSetupStatus } from "@/lib/paymob";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** Public payment availability (booleans only, never keys). */
export async function GET() {
  const stripe = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const paymob = getPaymobSetupStatus();
  return NextResponse.json(
    { stripe, paymob: paymob.configured, cod: true },
    { headers: NO_STORE }
  );
}

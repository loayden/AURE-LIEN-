import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/lib/monitoring";

const schema = z.object({
  event: z.string().min(1).max(80),
  path: z.string().max(500).optional().default(""),
  productId: z.string().max(200).optional().default(""),
  userId: z.string().max(200).optional().default(""),
  value: z.number().optional().default(0),
  query: z.string().max(200).optional(),
  results_count: z.number().optional(),
});

const ALLOWED = new Set([
  "page_view",
  "product_view",
  "add_to_cart",
  "begin_checkout",
  "purchase",
  "search",
  "wishlist_add",
  "auth_signup",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ received: false }, { status: 400 });
    if (!ALLOWED.has(parsed.data.event)) return NextResponse.json({ received: false }, { status: 400 });
    await trackServerEvent({
      event: parsed.data.event,
      path: parsed.data.path,
      productId: parsed.data.productId,
      userId: parsed.data.userId,
      value: parsed.data.value,
      metadata: { query: parsed.data.query, results_count: parsed.data.results_count },
    });
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 200 });
  }
}

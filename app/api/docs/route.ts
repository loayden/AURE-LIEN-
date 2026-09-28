import { NextResponse } from "next/server";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * Minimal OpenAPI 3.0 spec for the public storefront API.
 * Full interactive docs can be generated from this with Swagger UI / Scalar.
 */
export async function GET() {
  return NextResponse.json(
    {
      openapi: "3.0.0",
      info: { title: "BOUT Storefront API", version: "1.0.0" },
      paths: {
        "/api/products": {
          get: {
            summary: "List products",
            parameters: [
              { name: "category", in: "query", schema: { type: "string" } },
              { name: "page", in: "query", schema: { type: "integer" } },
              { name: "limit", in: "query", schema: { type: "integer" } },
              { name: "currency", in: "query", schema: { type: "string", enum: ["EGP", "USD", "SAR", "AED"] } },
            ],
          },
        },
        "/api/cart": {
          get: { summary: "Get cart" },
          post: { summary: "Add to cart" },
          put: { summary: "Update quantity" },
          delete: { summary: "Remove item / clear" },
        },
        "/api/saveorder": {
          get: { summary: "List my orders (?page&limit)" },
          post: { summary: "Place COD order (idempotent via Idempotency-Key)" },
        },
        "/api/checkout": { post: { summary: "Create Stripe checkout session" } },
        "/api/reviews": {
          get: { summary: "List reviews (?productId)" },
          post: { summary: "Write review (auth required)" },
        },
        "/api/analytics": { post: { summary: "Track storefront event" } },
        "/api/loyalty": { get: { summary: "Loyalty points for current user" } },
        "/api/back-in-stock": { post: { summary: "Subscribe to back-in-stock email" } },
      },
    },
    { headers: NO_STORE }
  );
}

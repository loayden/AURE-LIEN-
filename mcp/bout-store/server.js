import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = process.env.BOUT_BASE_URL?.trim() || "http://localhost:3000";

async function api(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return data;
}

function slimProduct(p) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    category: p.category,
    stock: p.stock ?? null,
    boutique: p.boutique?.name ?? p.boutiqueName ?? null,
  };
}

const server = new McpServer({ name: "bout-store", version: "1.0.0" });

server.tool(
  "bout_store_health",
  "Check BOUT storefront health: database, product count, payment availability. No secrets exposed.",
  {},
  async () => {
    const data = await api("/api/health");
    const c = data.checks || {};
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ok: data.ok,
              products: c.productCount,
              mongo: c.mongoConnected,
              stripe: c.stripe,
              paymob: Boolean(c.paymob),
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

server.tool(
  "bout_list_products",
  "List storefront products. Use query/category/limit to narrow results.",
  {
    query: z.string().optional().describe("Search text"),
    category: z.string().optional().describe("Category slug, e.g. shirts"),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)"),
  },
  async ({ query, category, limit }) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    const data = await api(`/api/search?${params.toString()}`);
    const arr = Array.isArray(data) ? data : data.products || [];
    return {
      content: [{ type: "text", text: JSON.stringify(arr.slice(0, limit ?? 10).map(slimProduct), null, 2) }],
    };
  }
);

server.tool(
  "bout_get_product",
  "Get one product with price, stock, images, and boutique seller info.",
  { id: z.string().describe("Product _id") },
  async ({ id }) => {
    const p = await api(`/api/products/${encodeURIComponent(id)}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ...slimProduct(p),
              images: (p.images || []).slice(0, 4),
              description: (p.description || "").slice(0, 300),
              rating: p.rating ?? null,
              reviews: p.reviews ?? 0,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

server.tool(
  "bout_validate_coupon",
  "Check whether a coupon code gives a discount on a subtotal. Does not consume the coupon.",
  {
    code: z.string().describe("Coupon code"),
    subtotal: z.number().min(0).describe("Cart subtotal in EGP"),
  },
  async ({ code, subtotal }) => {
    const data = await api("/api/coupons", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    });
    return { content: [{ type: "text", text: JSON.stringify(data.coupon, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

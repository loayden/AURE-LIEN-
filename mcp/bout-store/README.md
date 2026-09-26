# BOUT store MCP server

Local stdio MCP server exposing safe, read-only storefront tools. No secrets in code; talks to the app over HTTP.

## Tools

- `bout_store_health` — database, product count, payment availability
- `bout_list_products` — search/list with slim fields
- `bout_get_product` — one product with boutique seller info
- `bout_validate_coupon` — quote a coupon (never consumes)

## Run

```bash
cd mcp/bout-store
npm install
BOUT_BASE_URL=http://localhost:3000 npm start
```

## Wire into opencode (`opencode.json`)

```json
{
  "mcp": {
    "bout-store": {
      "type": "local",
      "command": ["node", "mcp/bout-store/server.js"],
      "environment": { "BOUT_BASE_URL": "http://localhost:3000" }
    }
  }
}
```

Restart opencode after wiring. Point `BOUT_BASE_URL` at dev or production as needed.

# Data Directory

Centralized storage for JSON data files used by the luxury ecommerce platform.

| File | Purpose |
|------|---------|
| `cartData.json` | User cart items (userId, productId, quantity) |
| `orders.json` | Orders in saveorder format (customer, products, total, status) |
| `ordersData.json` | Orders in display format (products with names/prices, user, totalPrice) |

All paths are defined in `lib/dataPaths.ts`.

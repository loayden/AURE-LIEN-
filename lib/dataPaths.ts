/**
 * Centralized data file paths for the luxury ecommerce platform.
 * All JSON data files are stored in the data/ directory.
 */

import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export const paths = {
  cart: path.join(DATA_DIR, "cartData.json"),
  orders: path.join(DATA_DIR, "orders.json"),
  ordersData: path.join(DATA_DIR, "ordersData.json"),
  checkoutDrafts: path.join(DATA_DIR, "checkoutDrafts.json"),
  users: path.join(DATA_DIR, "users.json"),
  wishlist: path.join(DATA_DIR, "wishlist.json"),
  newsletter: path.join(DATA_DIR, "newsletter.json"),
  products: path.join(DATA_DIR, "products.json"),
} as const;

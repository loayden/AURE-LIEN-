const { chromium } = require("playwright");

const BASE = process.env.QA_BASE || "http://localhost:3128";
const TAG = `own${Date.now().toString(36)}`;
const EMAIL = `ownertest+${TAG}@example.com`;
const PW = "correct horse battery staple 99";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`user: ${String(e).slice(0, 140)}`));
  const apiErrors = [];
  page.on("response", (r) => {
    if (r.url().includes("/api/") && r.status() >= 500) apiErrors.push(`${r.status()} ${r.url().slice(0, 100)}`);
  });

  // signup -> login -> account
  let r = await page.request.post(`${BASE}/api/auth/signup`, { data: { name: "Owner Test", email: EMAIL, password: PW, confirmPassword: PW } });
  console.log("user: signup", r.status());
  r = await page.request.post(`${BASE}/api/auth/login`, { data: { email: EMAIL, password: PW } });
  console.log("user: login", r.status());
  await page.goto(`${BASE}/account`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/bout-qa/own-account.png" });

  // profile edit + birthday
  const patch = await page.request.patch(`${BASE}/api/users/me`, { data: { city: "Cairo", birthdate: "1990-05-17" } });
  console.log("user: profile patch", patch.status(), JSON.stringify(await patch.json()).slice(0, 120));

  // wishlist add + move to cart
  const products = await (await page.request.get(`${BASE}/api/products`)).json();
  const arr = Array.isArray(products) ? products : products.products || [];
  const target = arr.find((p) => (p.stock ?? 99) > 5 && (p.size || []).length <= 1) || arr[0];
  console.log("user: target product", target._id);
  r = await page.request.post(`${BASE}/api/wishlist/add`, { data: { productId: target._id } });
  console.log("user: wishlist add", r.status());
  await page.goto(`${BASE}/wishlist`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "/tmp/bout-qa/own-wishlist.png" });

  // cart + coupon quote + COD order with gift
  const pid = target._id;
  r = await page.request.post(`${BASE}/api/cart`, { data: { productId: pid, quantity: 1 } });
  console.log("user: cart add", r.status());
  r = await page.request.post(`${BASE}/api/saveorder`, {
    data: {
      items: [{ productId: pid, quantity: 1 }],
      total: 0,
      customerInfo: { email: EMAIL, firstName: "Owner", lastName: "Test", address: "1 St", city: "Cairo", country: "Egypt" },
      giftWrap: true,
      giftMessage: "QA ownership pass",
    },
    headers: { "Idempotency-Key": `own-${TAG}` },
  });
  const order = await r.json().catch(() => ({}));
  console.log("user: order", r.status(), order.orderId || order.error, "total:", order.total);

  // return request
  if (order.orderId) {
    r = await page.request.post(`${BASE}/api/returns`, { data: { orderId: order.orderId, reason: "QA size exchange ownership pass" } });
    console.log("user: return", r.status());
  }

  // referral code
  r = await page.request.get(`${BASE}/api/referrals`);
  console.log("user: referral", r.status(), JSON.stringify(await r.json()).slice(0, 80));

  // logout
  r = await page.request.post(`${BASE}/api/auth/logout`);
  console.log("user: logout", r.status());
  await page.goto(`${BASE}/account`, { timeout: 30000 }).catch(() => null);
  console.log("user: account after logout:", page.url().includes("/login") ? "redirected to login OK" : "STILL AUThed? " + page.url());

  await browser.close();
  console.log("JS errors:", errors.length ? "" : "none");
  errors.slice(0, 8).forEach((e) => console.log(" -", e));
  console.log("API 5xx:", apiErrors.length ? "" : "none");
  apiErrors.slice(0, 8).forEach((e) => console.log(" -", e));
  console.log("ORDER_ID=" + (order.orderId || ""));
  console.log("USER_EMAIL=" + EMAIL);
})().catch((e) => {
  console.error("QA failed:", e.message);
  process.exit(1);
});

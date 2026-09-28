const { chromium } = require("playwright");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.local" });

const BASE = process.env.QA_BASE || "http://localhost:3128";
const ORDER_ID = process.env.QA_ORDER || "";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const token = jwt.sign(
    { userId: "healthcheck-admin", email: "admincheck@local", role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  await ctx.addCookies([{ name: "auth_token", value: token, domain: "localhost", path: "/" }]);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`admin: ${String(e).slice(0, 140)}`));

  for (const path of ["/admin", "/admin/orders", "/admin/products", "/admin/boutiques", "/admin/audit", "/admin/coupons", "/admin/inventory"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
    await page.waitForTimeout(1200);
    const bounced = page.url().includes("/login");
    console.log(`admin: ${path} -> ${bounced ? "BOUNCED TO LOGIN (bad)" : "rendered OK"}`);
    await page.screenshot({ path: `/tmp/bout-qa/own-admin${path.replace(/\//g, "-")}.png` });
  }

  // coupon lifecycle
  let r = await page.request.put(`${BASE}/api/coupons`, { data: { code: "OWNQA5", kind: "percent", value: 5, maxUses: 2 } });
  console.log("admin: coupon create", r.status());
  r = await page.request.delete(`${BASE}/api/coupons?code=OWNQA5`);
  console.log("admin: coupon deactivate", r.status());

  // order status on own test order
  if (ORDER_ID) {
    r = await page.request.patch(`${BASE}/api/admin/orders`, { data: { orderId: ORDER_ID, status: "processing", note: "QA ownership pass" } });
    console.log("admin: order status", r.status(), JSON.stringify(await r.json()).slice(0, 120));
    r = await page.request.patch(`${BASE}/api/admin/orders`, { data: { orderId: ORDER_ID, trackingNumber: "QA-TRACK-001" } });
    console.log("admin: tracking", r.status());
  }

  // audit visible?
  r = await page.request.get(`${BASE}/api/admin/audit?limit=3`);
  const audit = await r.json().catch(() => ({}));
  console.log("admin: audit", r.status(), "entries:", (audit.logs || []).length);

  // inventory health
  r = await page.request.get(`${BASE}/api/admin/inventory?slow=1`);
  const inv = await r.json().catch(() => ({}));
  console.log("admin: inventory", r.status(), "slow:", inv.slowCount);

  // boutique funnel
  r = await page.request.get(`${BASE}/api/admin/boutiques/funnel`);
  console.log("admin: funnel", r.status(), JSON.stringify(await r.json()).slice(0, 120));

  await browser.close();
  console.log("JS errors:", errors.length ? "" : "none");
  errors.slice(0, 8).forEach((e) => console.log(" -", e));
})().catch((e) => {
  console.error("QA failed:", e.message);
  process.exit(1);
});

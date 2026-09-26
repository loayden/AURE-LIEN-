const { chromium } = require("playwright");

const BASE = process.env.QA_BASE || "http://localhost:3127";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
  page.on("response", (r) => {
    if (r.url().includes("/api/cart")) console.log("cart API:", r.request().method(), r.status());
  });
  await page.goto(`${BASE}/product/p-summer-jacket-001`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  await page.waitForTimeout(1500);
  const sizes = await page.getByRole("button", { name: /select size/i }).count();
  const colors = await page.getByRole("button", { name: /select .* color/i }).count();
  console.log("size options:", sizes, "| color options:", colors);
  if (sizes) await page.getByRole("button", { name: /select size/i }).first().click().catch(() => null);
  if (colors) await page.getByRole("button", { name: /select .* color/i }).first().click().catch(() => null);
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /add to cart/i }).first().click().catch(() => null);
  await page.waitForTimeout(2000);
  const bodyText = await page.locator("body").innerText().catch(() => "");
  const errMatch = bodyText.match(/(select|choose|sold out|failed)[^.]{0,60}/gi);
  console.log("hints:", errMatch ? errMatch.slice(0, 3).join(" | ") : "none visible");
  const cart = await page.evaluate(async () => {
    const r = await fetch("/api/cart", { cache: "no-store" });
    return r.json();
  });
  console.log("cart items:", (cart.items || []).length, JSON.stringify(cart.items || []).slice(0, 160));
  await browser.close();
})().catch((e) => {
  console.error("failed:", e.message);
  process.exit(1);
});

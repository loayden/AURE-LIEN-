const { chromium } = require("playwright");

const BASE = process.env.QA_BASE || "http://localhost:3127";
const OUT = "/tmp/bout-qa";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`journey: ${String(e).slice(0, 160)}`));

  const res = await fetch(`${BASE}/api/products`);
  const data = await res.json();
  const arr = Array.isArray(data) ? data : data.products || [];
  const ids = arr.slice(0, 2).map((p) => p._id);
  console.log("journey: testing products:", ids.join(", "));

  for (const id of ids) {
    await page.goto(`${BASE}/product/${id}`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/mobile-360-product-${id.slice(0, 12)}.png` });
    const sizeBtn = page.getByRole("button", { name: /select size/i }).first();
    if (await sizeBtn.count()) {
      await sizeBtn.click().catch(() => null);
      await page.waitForTimeout(400);
    }
    const colorBtn = page.getByRole("button", { name: /select .* color/i }).first();
    if (await colorBtn.count()) {
      await colorBtn.click().catch(() => null);
      await page.waitForTimeout(400);
    }
    const addBtn = page.getByRole("button", { name: /add to cart/i }).first();
    if (await addBtn.count()) {
      await addBtn.click().catch(() => null);
      await page.waitForTimeout(1500);
      console.log(`journey: ${id} add-to-cart clicked`);
    } else {
      console.log(`journey: ${id} size selection required (expected)`);
    }
  }

  // cart badge/state after adds
  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/mobile-360-cart.png` });
  const cartText = await page.locator("body").innerText().catch(() => "");
  console.log("journey: cart page mentions items:", /quantity|EGP|total/i.test(cartText));

  await browser.close();
  console.log("JS errors:", errors.length ? "" : "none");
  errors.slice(0, 8).forEach((e) => console.log(" -", e));
})().catch((e) => {
  console.error("QA failed:", e.message);
  process.exit(1);
});

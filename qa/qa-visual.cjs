const { chromium } = require("playwright");

const BASE = process.env.QA_BASE || "http://localhost:3127";
const OUT = "/tmp/bout-qa";
require("fs").mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 780 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      page.on("pageerror", (e) => errors.push(`${vp.name}: ${String(e).slice(0, 160)}`));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`${vp.name} console: ${m.text().slice(0, 160)}`);
      });
      for (const [slug, path] of [["home", "/"], ["shop", "/shop"], ["boutiques", "/boutiques"], ["checkout", "/checkout"]]) {
        await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
        await page.waitForTimeout(1200);
        await page.screenshot({ path: `${OUT}/${vp.name}-${slug}.png` });
      }
      // horizontal overflow check on home
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      console.log(`${vp.name}: overflow-x=${overflow}px`);
      await page.close();
    }

    // scripted journey (mobile): search -> product -> add to cart -> cart badge
    const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
    page.on("pageerror", (e) => errors.push(`journey: ${String(e).slice(0, 160)}`));
    await page.goto(BASE + "/shop", { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
    await page.waitForTimeout(1000);
    const firstLink = page.locator('a[href^="/product/"]').first();
    const href = await firstLink.getAttribute("href").catch(() => null);
    console.log("journey: first product link:", href);
    if (href) {
      await page.goto(BASE + href, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${OUT}/mobile-360-product.png` });
      const addBtn = page.getByRole("button", { name: /add to cart/i }).first();
      if (await addBtn.count()) {
        await addBtn.click().catch(() => null);
        await page.waitForTimeout(1500);
        console.log("journey: add-to-cart clicked");
      } else {
        console.log("journey: add-to-cart button not found (size selection likely required)");
      }
      await page.screenshot({ path: `${OUT}/mobile-360-product-after.png` });
    }
    await page.close();
  } finally {
    await browser.close();
  }
  console.log("JS errors:", errors.length ? "" : "none");
  errors.slice(0, 12).forEach((e) => console.log(" -", e));
})().catch((e) => {
  console.error("QA failed:", e.message);
  process.exit(1);
});

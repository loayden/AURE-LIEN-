const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.env.QA_BASE || "http://localhost:3129";
const OUT = process.env.QA_OUT || "/tmp/bout-split-base";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  for (const vp of [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const slug of ["", "shop"]) {
      await page.goto(`${BASE}/${slug}`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
      await page.waitForTimeout(1500);
      const name = slug === "" ? "home" : slug;
      await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png` });
      const html = await page.evaluate(() => {
        const el = document.querySelector("main") || document.body;
        return el.innerHTML.replace(/\s+/g, " ").slice(0, 200000);
      });
      fs.writeFileSync(`${OUT}/${vp.name}-${name}.dom.txt`, html);
      console.log(`captured ${vp.name}-${name}`);
    }
    await page.close();
  }
  await browser.close();
})().catch((e) => {
  console.error("failed:", e.message);
  process.exit(1);
});

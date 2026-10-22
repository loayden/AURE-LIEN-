/* Phase 8+9: responsive/RTL/overflow spot checks + API price consistency. */
const { chromium } = require("playwright");
const BASE = process.env.QA_BASE || "http://localhost:3000";
const OUT = "/tmp/bout-e2e";
let pass = 0, fail = 0;
function report(name, ok, detail = "") {
  if (ok) pass++; else fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

(async () => {
  const fs = require("fs");
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  // ─── MOBILE VIEWPORT (360px) ───
  console.log("=== MOBILE 360px ===");
  const mctx = await browser.newContext({ viewport: { width: 360, height: 780 } });
  const mpage = await mctx.newPage();
  for (const path of ["/", "/shop", "/cart", "/checkout", "/boutiques", "/login"]) {
    await mpage.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => null);
    await mpage.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
    await mpage.waitForTimeout(800);
    const overflow = await mpage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const ok = overflow <= 2; // allow 2px tolerance
    report(`mobile: no horizontal overflow ${path}`, ok, `overflow=${overflow}px`);
    await mpage.screenshot({ path: `${OUT}/mobile${path.replace(/\//g, "-") || "-home"}.png` });
  }

  // ─── RTL / ARABIC ───
  console.log("\n=== RTL ===");
  await mpage.goto(`${BASE}/boutiques`, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => null);
  await mpage.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  const hasArabic = /[\u0600-\u06FF]/.test(await mpage.content());
  report("boutiques: Arabic content present", hasArabic);
  const dirAttr = await mpage.evaluate(() => document.documentElement.getAttribute("dir") || "ltr");
  console.log(`  html dir=${dirAttr}`);
  await mpage.screenshot({ path: `${OUT}/rtl-boutiques.png` });

  // ─── DESKTOP CONTRAST SPOT CHECKS ───
  console.log("\n=== DESKTOP CONTRAST ===");
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dpage = await dctx.newPage();
  await dpage.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => null);
  await dpage.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await dpage.waitForTimeout(1500);
  // sample button text/bg contrast pairs
  const pairs = await dpage.evaluate(() => {
    function lum(c) {
      const m = c.match(/\d+(\.\d+)?/g); if (!m) return null;
      const [r, g, b] = m.map(Number);
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }
    const out = [];
    const buttons = Array.from(document.querySelectorAll("button, a[role='button'], form button, a.rounded-full, a[href='/boutiques/apply']")).slice(0, 40);
    for (const el of buttons) {
      const text = (el.textContent || "").trim();
      if (!text || text.length > 40) continue;
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const color = cs.color;
      if (bg === "rgba(0, 0, 0, 0)") continue;
      const l1 = lum(color), l2 = lum(bg);
      if (l1 == null || l2 == null) continue;
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      out.push({ text: text.slice(0, 30), ratio: Math.round(ratio * 100) / 100 });
    }
    return out;
  });
  let bad = 0;
  for (const p of pairs) {
    if (p.ratio < 3) { bad++; console.log(`  LOW contrast ${p.ratio}: "${p.text}"`); }
  }
  report("home: sampled button contrast >= 3:1", bad === 0, `${pairs.length} sampled, ${bad} low`);

  // ─── API PRICE CONSISTENCY ───
  console.log("\n=== API PRICE CONSISTENCY ===");
  const prodRes = await dpage.request.get(`${BASE}/api/products`);
  const prodData = await prodRes.json().catch(() => ({}));
  const products = Array.isArray(prodData) ? prodData : prodData.products || [];
  const p0 = products[0];
  if (p0) {
    report("api: product has price + id", typeof p0.price === "number" && !!p0._id, `${p0._id} @ ${p0.price}`);
    // add to cart via API with Origin
    const addRes = await dpage.request.post(`${BASE}/api/cart`, {
      data: { productId: p0._id, quantity: 2, size: "M", color: "black" },
      headers: { Origin: BASE },
    }).catch(() => null);
    report("api: cart add accepted", addRes && addRes.ok, `status=${addRes ? addRes.status() : 0}`);
    const cartRes = await dpage.request.get(`${BASE}/api/cart`).catch(() => null);
    const cart = cartRes && cartRes.ok ? await cartRes.json().catch(() => ({})) : {};
    const items = cart.items || [];
    const cartLine = items.find((i) => i.productId === p0._id);
    if (cartLine) {
      const unitPrice = cartLine.price ?? cartLine.unitPrice ?? null;
      report("api: cart unit price matches catalog", unitPrice == null || unitPrice === p0.price, `catalog=${p0.price} cart=${unitPrice}`);
      report("api: cart quantity honored", Number(cartLine.quantity) === 2, `qty=${cartLine.quantity}`);
    } else {
      report("api: cart contains added product", false, `items=${items.length}`);
    }
    // saveorder with mismatched total — server must recalc, not trust client
    const orderRes = await dpage.request.post(`${BASE}/api/saveorder`, {
      data: {
        items: [{ productId: p0._id, quantity: 1, size: "M", color: "black" }],
        total: 1, // lies about the total
        paymentMethod: "cod",
        customerInfo: { email: "consistency@test.com", firstName: "C", lastName: "T", address: "1 St", city: "Cairo", phone: "01000000009" },
      },
      headers: { Origin: BASE },
    }).catch(() => null);
    if (orderRes && orderRes.ok) {
      const od = await orderRes.json().catch(() => ({}));
      // saveorder returns a flat shape: { success, orderId, total, status, paymentStatus }
      const serverTotal = od.total;
      report("api: server rejects client-underpriced total", typeof serverTotal === "number" && serverTotal > 1, `serverTotal=${serverTotal} (client said 1)`);
      report("api: order status starts pending", od.status === "pending", `status=${od.status}`);
      report("api: order paymentStatus not forged", od.paymentStatus !== "paid", `paymentStatus=${od.paymentStatus}`);
      report("api: order id returned", typeof od.orderId === "string" && od.orderId.length > 0, `orderId=${od.orderId}`);
    } else {
      report("api: saveorder created", false, `status=${orderRes ? orderRes.status() : 0}`);
    }
  } else {
    report("api: products available", false, "no products");
  }

  await browser.close();
  console.log(`\n========== UI/API SUMMARY ==========`);
  console.log(`PASS: ${pass}  FAIL: ${fail}  TOTAL: ${pass + fail}`);
  if (fail > 0) results_fail = true;
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => { console.error("crashed:", e); process.exit(2); });

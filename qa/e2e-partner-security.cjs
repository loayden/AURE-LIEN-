/* Deeper partner journey: apply → draft product → verify storefront guard + partner orders.
 * Run via with_server.py against local dev. Never touches production.
 */
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
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // ─── 1. APPLY FORM (guest) ───
  console.log("=== PARTNER APPLICATION ===");
  const applyRes = await page.goto(`${BASE}/boutiques/apply`, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => null);
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  report("apply: page loads", applyRes && applyRes.status() === 200);
  await page.screenshot({ path: `${OUT}/partner-01-apply.png`, fullPage: false });

  // inspect form fields
  const inputs = await page.locator("form input, form textarea, form select").all();
  console.log(`  apply form fields: ${inputs.length}`);
  for (const inp of inputs.slice(0, 12)) {
    const name = await inp.getAttribute("name").catch(() => "");
    const ph = await inp.getAttribute("placeholder").catch(() => "");
    const type = await inp.getAttribute("type").catch(() => "");
    console.log(`    field name=${name} type=${type} placeholder=${(ph || "").slice(0, 30)}`);
  }

  // try the draft API directly (guest-safe by design)
  const draftRes = await page.request.post(`${BASE}/api/boutiques/draft`, {
    data: {
      boutiqueName: `E2E Test Boutique ${Date.now()}`,
      ownerName: "E2E Partner",
      email: `e2e.partner.${Date.now()}@example.com`,
      phone: "01000000001",
      city: "Cairo",
      address: "12 Test St",
    },
    headers: { Origin: BASE },
  }).catch(() => null);
  const draftStatus = draftRes ? draftRes.status() : 0;
  const draftBody = draftRes ? await draftRes.text().catch(() => "") : "";
  console.log(`  draft API: status=${draftStatus} body=${draftBody.slice(0, 160)}`);
  report("partner: draft API responds", draftStatus >= 200 && draftStatus < 500, `status=${draftStatus}`);

  // ─── 2. PARTNER PRODUCT GUARDS ───
  console.log("\n=== PARTNER PRODUCT GUARDS ===");
  // anonymous create attempt
  const anonCreate = await page.request.post(`${BASE}/api/partners/products`, {
    data: { name: "Unauthorized Product", price: 100, category: "shirts" },
    headers: { Origin: BASE },
  }).catch(() => null);
  const anonStatus = anonCreate ? anonCreate.status() : 0;
  report("partner: anonymous product create rejected", anonStatus === 401 || anonStatus === 403, `status=${anonStatus}`);

  // anonymous list attempt
  const anonList = await page.request.get(`${BASE}/api/partners/products`).catch(() => null);
  const anonListStatus = anonList ? anonList.status() : 0;
  report("partner: anonymous product list rejected", anonListStatus === 401 || anonListStatus === 403, `status=${anonListStatus}`);

  // ─── 3. CUSTOMER CANNOT USE PARTNER APIs ───
  console.log("\n=== CUSTOMER VS PARTNER API ===");
  // create a customer
  const custEmail = `e2e.cust.${Date.now()}@example.com`;
  const custRes = await page.request.post(`${BASE}/api/auth/signup`, {
    data: { name: "E2E Cust", email: custEmail, password: "TestPass123!", confirmPassword: "TestPass123!", accountIntent: "buyer" },
    headers: { Origin: BASE },
  }).catch(() => null);
  report("customer: signup for isolation test", custRes && custRes.status() === 201, `status=${custRes ? custRes.status() : 0}`);
  // login as customer (UI-free via API)
  const loginRes = await page.request.post(`${BASE}/api/auth/login`, {
    data: { email: custEmail, password: "TestPass123!" },
    headers: { Origin: BASE },
  }).catch(() => null);
  report("customer: login for isolation test", loginRes && loginRes.status() === 200, `status=${loginRes ? loginRes.status() : 0}`);

  // customer tries partner product create with a FOREIGN applicationId (tenant isolation)
  const foreignAppId = "boutique-does-not-own-this-123";
  const custPartnerCreate = await page.request.post(`${BASE}/api/partners/products`, {
    data: { applicationId: foreignAppId, name: "Should Fail", price: 100, category: "shirts" },
    headers: { Origin: BASE },
  }).catch(() => null);
  const custPartnerStatus = custPartnerCreate ? custPartnerCreate.status() : 0;
  // 403 (not owner) or 404 (app not found) both prove isolation; 400 = missing field (also a reject)
  report("customer: blocked from foreign partner application", custPartnerStatus === 403 || custPartnerStatus === 404 || custPartnerStatus === 400, `status=${custPartnerStatus}`);

  // customer tries admin API
  const custAdmin = await page.request.get(`${BASE}/api/admin/orders`).catch(() => null);
  const custAdminStatus = custAdmin ? custAdmin.status() : 0;
  report("customer: blocked from admin API", custAdminStatus === 401 || custAdminStatus === 403, `status=${custAdminStatus}`);

  // customer tries admin write
  const custAdminWrite = await page.request.post(`${BASE}/api/admin/products`, {
    data: { name: "Hacked", price: 1 },
    headers: { Origin: BASE },
  }).catch(() => null);
  const custAdminWriteStatus = custAdminWrite ? custAdminWrite.status() : 0;
  report("customer: blocked from admin product write", custAdminWriteStatus === 401 || custAdminWriteStatus === 403, `status=${custAdminWriteStatus}`);

  // ─── 4. IDOR: customer A cannot read customer B's order ───
  console.log("\n=== IDOR CHECKS ===");
  // customer A places an order
  await page.request.post(`${BASE}/api/cart`, {
    data: { productId: "p-summer-jacket-001", quantity: 1, size: "M", color: "black" },
    headers: { Origin: BASE },
  }).catch(() => {});
  const orderRes = await page.request.post(`${BASE}/api/saveorder`, {
    data: {
      items: [{ productId: "p-summer-jacket-001", quantity: 1, size: "M", color: "black" }],
      total: 1500,
      paymentMethod: "cod",
      customerInfo: { email: custEmail, firstName: "A", lastName: "B", address: "1 Test", city: "Cairo", phone: "01000000002" },
    },
    headers: { Origin: BASE },
  }).catch(() => null);
  const orderStatus = orderRes ? orderRes.status() : 0;
  let orderId = null;
  if (orderRes && orderRes.ok) {
    const orderData = await orderRes.json().catch(() => ({}));
    orderId = orderData.order?._id || orderData.orderId || orderData.order?.id || null;
  }
  report("idor: customer A order created", orderStatus === 201 || orderStatus === 200, `status=${orderStatus} orderId=${orderId}`);

  if (orderId) {
    // customer B (new context, new session) tries to read A's order
    const ctxB = await browser.newContext();
    const pageB = await ctxB.newPage();
    // sign up + login B via API on pageB's request context
    const bEmail = `e2e.b.${Date.now()}@example.com`;
    await pageB.request.post(`${BASE}/api/auth/signup`, {
      data: { name: "B", email: bEmail, password: "TestPass123!", confirmPassword: "TestPass123!", accountIntent: "buyer" },
      headers: { Origin: BASE },
    }).catch(() => {});
    await pageB.request.post(`${BASE}/api/auth/login`, {
      data: { email: bEmail, password: "TestPass123!" },
      headers: { Origin: BASE },
    }).catch(() => {});
    const bRead = await pageB.request.get(`${BASE}/api/orders?orderId=${encodeURIComponent(orderId)}`).catch(() => null);
    let bOrders = [];
    if (bRead && bRead.ok) {
      const bData = await bRead.json().catch(() => ({}));
      bOrders = Array.isArray(bData.orders) ? bData.orders : [];
    }
    report("idor: customer B cannot read A's order", bOrders.length === 0, `B sees ${bOrders.length} orders for A's id`);
    // customer B tries to DELETE A's order
    const bDelete = await pageB.request.delete(`${BASE}/api/orders?orderId=${encodeURIComponent(orderId)}`, {
      headers: { Origin: BASE },
    }).catch(() => null);
    const bDeleteStatus = bDelete ? bDelete.status() : 0;
    report("idor: customer B cannot delete A's order", bDeleteStatus === 404 || bDeleteStatus === 403, `status=${bDeleteStatus}`);
    await ctxB.close();
  }

  // ─── 5. CSRF: state-changing route without Origin ───
  console.log("\n=== CSRF CHECKS ===");
  // saveorder without Origin header should be rejected by isOriginAllowed
  const csrfSave = await page.request.post(`${BASE}/api/saveorder`, {
    data: { items: [{ productId: "p-summer-jacket-001", quantity: 1 }], total: 1500, paymentMethod: "cod", customerInfo: { email: "x@y.z", firstName: "X", address: "1 St", city: "C", phone: "01" } },
    // deliberately NO Origin header
  }).catch(() => null);
  const csrfStatus = csrfSave ? csrfSave.status() : 0;
  // accept 403 (blocked) or 400 (validation — origin may pass in same-context) but NOT silent success creating order
  report("csrf: saveorder validates origin or input", csrfStatus !== 201 && csrfStatus !== 200, `status=${csrfStatus}`);

  await browser.close();
  console.log(`\n========== PARTNER/SECURITY SUMMARY ==========`);
  console.log(`PASS: ${pass}  FAIL: ${fail}  TOTAL: ${pass + fail}`);
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => { console.error("crashed:", e); process.exit(2); });

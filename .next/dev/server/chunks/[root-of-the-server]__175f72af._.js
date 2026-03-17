module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TOKEN_COOKIE",
    ()=>TOKEN_COOKIE,
    "getAuthFromCookies",
    ()=>getAuthFromCookies,
    "getAuthFromRequest",
    ()=>getAuthFromRequest,
    "hashPassword",
    ()=>hashPassword,
    "signToken",
    ()=>signToken,
    "verifyPassword",
    ()=>verifyPassword,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$bcrypt$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs, [project]/Documents/GitHub/AURE-LIEN-/node_modules/bcrypt)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
;
const JWT_SECRET = process.env.JWT_SECRET || "luxury-secret-change-in-production";
const TOKEN_COOKIE = "auth_token";
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$bcrypt$29$__["default"].hash(password, 12);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$bcrypt$29$__["default"].compare(password, hash);
}
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: "7d"
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch  {
        return null;
    }
}
async function getAuthFromRequest(req) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
}
async function getAuthFromCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(TOKEN_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
}
;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/dataPaths.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "paths",
    ()=>paths
]);
/**
 * Centralized data file paths for the luxury ecommerce platform.
 * All JSON data files are stored in the data/ directory.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const paths = {
    cart: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "cartData.json"),
    orders: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "orders.json"),
    ordersData: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "ordersData.json"),
    checkoutDrafts: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "checkoutDrafts.json"),
    users: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "users.json"),
    wishlist: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "wishlist.json"),
    products: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, "products.json")
};
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/orderStorage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOrdersDataJson",
    ()=>getOrdersDataJson,
    "getOrdersJson",
    ()=>getOrdersJson,
    "setOrdersDataJson",
    ()=>setOrdersDataJson,
    "setOrdersJson",
    ()=>setOrdersJson
]);
/**
 * Order storage: local JSON files when running on your PC,
 * Vercel Blob when deployed (Vercel/Netlify etc.) so orders persist and you can export them.
 * Scale: supports up to 100k+ orders (single JSON in Blob; export downloads all to your PC).
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/dataPaths.ts [app-route] (ecmascript)");
;
;
const BLOB_ORDERS_PATH = "orders.json";
const BLOB_ORDERS_DATA_PATH = "ordersData.json";
function useCloudStorage() {
    return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}
async function readLocalJson(filePath) {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch  {
        return [];
    }
}
async function writeLocalJson(filePath, data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(data, null, 2));
}
async function readBlobByPathname(pathname) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;
    const { list } = await __turbopack_context__.A("[project]/Documents/GitHub/AURE-LIEN-/node_modules/@vercel/blob/dist/index.js [app-route] (ecmascript, async loader)");
    const result = await list({
        prefix: pathname.replace(/\.[^/.]+$/, "")
    });
    const blob = result.blobs.find((b)=>b.pathname === pathname);
    if (!blob) return null;
    const res = await fetch(blob.url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) return null;
    return res.text();
}
async function getOrdersJson() {
    if (!useCloudStorage()) {
        return readLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].orders);
    }
    try {
        const text = await readBlobByPathname(BLOB_ORDERS_PATH);
        if (!text) return [];
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [];
    } catch  {
        return [];
    }
}
async function getOrdersDataJson() {
    if (!useCloudStorage()) {
        return readLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].ordersData);
    }
    try {
        const text = await readBlobByPathname(BLOB_ORDERS_DATA_PATH);
        if (!text) return [];
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [];
    } catch  {
        return [];
    }
}
async function setOrdersJson(orders) {
    if (!useCloudStorage()) {
        await writeLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].orders, orders);
        return;
    }
    const { put } = await __turbopack_context__.A("[project]/Documents/GitHub/AURE-LIEN-/node_modules/@vercel/blob/dist/index.js [app-route] (ecmascript, async loader)");
    await put(BLOB_ORDERS_PATH, JSON.stringify(orders, null, 2), {
        access: "public",
        contentType: "application/json"
    });
}
async function setOrdersDataJson(ordersData) {
    if (!useCloudStorage()) {
        await writeLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].ordersData, ordersData);
        return;
    }
    const { put } = await __turbopack_context__.A("[project]/Documents/GitHub/AURE-LIEN-/node_modules/@vercel/blob/dist/index.js [app-route] (ecmascript, async loader)");
    await put(BLOB_ORDERS_DATA_PATH, JSON.stringify(ordersData, null, 2), {
        access: "public",
        contentType: "application/json"
    });
}
}),
"[project]/Documents/GitHub/AURE-LIEN-/app/api/admin/export-orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$orderStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/orderStorage.ts [app-route] (ecmascript)");
;
;
;
async function GET(req) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(req);
    if (!auth || auth.role !== "admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Not authorized"
        }, {
            status: 403
        });
    }
    try {
        const [orders, ordersData] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$orderStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrdersJson"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$orderStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrdersDataJson"])()
        ]);
        const payload = {
            exportedAt: new Date().toISOString(),
            count: orders.length,
            orders,
            ordersData
        };
        const json = JSON.stringify(payload, null, 2);
        const filename = `orders-export-${new Date().toISOString().slice(0, 10)}.json`;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](json, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="${filename}"`
            }
        });
    } catch (e) {
        console.error("Export orders error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to export orders"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__175f72af._.js.map
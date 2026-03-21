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
"[project]/Documents/GitHub/AURE-LIEN-/lib/productsData.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const productsData = [
    // Jackets & Coats
    {
        _id: "p-jc-001",
        name: "Black Minimal Leather Jacket",
        category: "jackets-coats",
        price: 1199,
        images: [
            "/uploads/lether.jpg",
            "/uploads/simple_leather.jpg"
        ],
        size: [
            "S",
            "M",
            "L",
            "XL"
        ],
        description: "Black Minimal Leather Jacket",
        colors: [
            "black"
        ]
    },
    {
        _id: "p-jc-002",
        name: "Vintage Knit Cardigan",
        category: "jackets-coats",
        price: 1249,
        images: [
            "/uploads/korean_bijam_peig2.jpg",
            "/uploads/pijam_korean_jacket_black2.jpg",
            "/uploads/korean_bijam_peig.jpg",
            "/uploads/pijam_korean_jacket_black.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Vintage Knit Cardigan",
        colors: [
            "black",
            "cream"
        ]
    },
    {
        _id: "p-jc-003",
        name: "Wool-Blend Trench Coat",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/whitejacket.jpg",
            "/uploads/peig_leather_jacket.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "A modern trench with a tailored shoulder.",
        colors: [
            "cream"
        ]
    },
    {
        _id: "p-jc-004",
        name: "Studded Biker Jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/harly.jpg",
            "/uploads/mozz2.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Studded Biker Jacket",
        colors: [
            "black"
        ]
    },
    {
        _id: "p-jc-005",
        name: "Oversized Winter Puffer",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/mozzz.jpg",
            "/uploads/mozz.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Oversized Winter Puffer",
        colors: [
            "navy"
        ]
    },
    {
        _id: "p-jc-006",
        name: "Vintage Purple Work",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/purblejacket.jpg",
            "/uploads/light_violet_jacket.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Vintage Purple Work jacket",
        colors: [
            "violet"
        ]
    },
    {
        _id: "p-jc-007",
        name: "Navy Embroidered Bomber",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/italian_jacket3.jpg",
            "/uploads/italian_jacket.jpg",
            "/uploads/italian_jacket2.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Navy Embroidered Bomber",
        colors: [
            "camel",
            "navy"
        ]
    },
    {
        _id: "p-jc-008",
        name: "Slim Black Biker Jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/leathercrazy.jpg",
            "/uploads/harly2.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Slim Black Biker Jacket",
        colors: [
            "black"
        ]
    },
    {
        _id: "p-jc-009",
        name: "Sage Minimal Street Set",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/formal_lines2.jpg",
            "/uploads/formal_lines.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Sage Minimal Street Set",
        colors: [
            "black"
        ]
    },
    {
        _id: "p-jc-010",
        name: "Camel Leather jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/brown_leather2.jpg",
            "/uploads/brown_leather.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Camel Leather jacket",
        colors: [
            "camel"
        ]
    },
    {
        _id: "p-jc-011",
        name: "Urban Brown Leather Jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/brownleather2.jpg",
            "/uploads/brown_wind_jacket.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Urban Brown Leather Jacket",
        colors: [
            "brown"
        ]
    },
    {
        _id: "p-jc-012",
        name: "Dark Urban Bomber Jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/black.jpg",
            "/uploads/black_wind_jacket.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Dark Urban Bomber Jacket",
        colors: [
            "black"
        ]
    },
    {
        _id: "p-jc-013",
        name: "Minimal Black Winter Jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/noir.jpg",
            "/uploads/black_soft_jacket.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Minimal Black Winter Jacket",
        colors: [
            "black"
        ]
    },
    {
        _id: "p-jc-014",
        name: "gray Urban Bomber Jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/greyjacket.jpg",
            "/uploads/greyjacket2.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "gray Urban Bomber Jacket",
        colors: [
            "gray"
        ]
    },
    {
        _id: "p-jc-015",
        name: "Sage Minimal pockets jacket",
        category: "jackets-coats",
        price: 749,
        images: [
            "/uploads/formallinespockets.jpg",
            "/uploads/pocket.jpg"
        ],
        size: [
            "M",
            "L",
            "XL"
        ],
        description: "Sage Minimal pockets Street Set",
        colors: [
            "black"
        ]
    },
    // Suits
    {
        _id: "p-su-001",
        name: "Minimal Cream Street Set",
        category: "suits",
        price: 2149,
        images: [
            "/uploads/whitesuit.jpg",
            "/uploads/peig_suit2.jpg"
        ],
        size: [
            "38",
            "40",
            "42",
            "44"
        ],
        description: "Minimal Cream Street Set",
        colors: [
            "cream"
        ]
    },
    {
        _id: "p-su-003",
        name: "Mocha Casual Street Set",
        category: "suits",
        price: 2149,
        images: [
            "/uploads/brownsuit.jpg",
            "/uploads/brown_suit.jpg"
        ],
        size: [
            "38",
            "40",
            "42"
        ],
        description: "Mocha Casual Street Set",
        colors: [
            "mocha"
        ]
    },
    // Shirts
    {
        _id: "p-sh-001",
        name: "Olive Minimal green Knit",
        category: "shirts",
        price: 109,
        images: [
            "/uploads/gre.jpg",
            "/uploads/green_zipper.jpg"
        ],
        size: [
            "S",
            "M",
            "L",
            "XL"
        ],
        description: "Olive Minimal green Knit",
        colors: [
            "green"
        ]
    },
    {
        _id: "p-sh-002",
        name: "beige polo classic",
        category: "shirts",
        price: 95,
        images: [
            "/uploads/peigshirt.jpg",
            "/uploads/peig.jpg"
        ],
        size: [
            "S",
            "M",
            "L",
            "XL"
        ],
        description: "beige polo classic",
        colors: [
            "beige"
        ]
    }
];
const __TURBOPACK__default__export__ = productsData;
}),
"[project]/Documents/GitHub/AURE-LIEN-/app/api/admin/users/[userId]/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/dataPaths.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$orderStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/orderStorage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/productsData.ts [app-route] (ecmascript)");
;
;
;
;
;
;
function enrichOrderItems(raw) {
    return (raw || []).map((p)=>{
        const product = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find((x)=>String(x._id) === String(p._id || p.productId));
        return {
            productId: p._id || p.productId,
            quantity: p.quantity ?? 1,
            name: product?.name ?? "Unknown",
            price: product?.price ?? 0,
            image: product?.images?.[0] ?? "/images/placeholder.svg"
        };
    });
}
async function GET(req, { params }) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(req);
    if (!auth || auth.role !== "admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Not authorized"
        }, {
            status: 403
        });
    }
    const { userId } = await params;
    if (!userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "userId required"
        }, {
            status: 400
        });
    }
    try {
        let user = null;
        try {
            const usersData = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].users, "utf-8");
            const users = JSON.parse(usersData);
            user = users.find((u)=>u.id === userId) ?? null;
        } catch  {
        // users.json missing — resolve from orders below
        }
        const raw = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$orderStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrdersJson"])();
        const userOrders = raw.filter((o)=>{
            if (o.userId === userId) return true;
            if (user && o.customer?.email && o.customer.email.toLowerCase() === user.email.toLowerCase()) return true;
            // Customer from orders only: id might be "order-email" or actual userId from order
            if (userId.startsWith("order-") && o.customer?.email) {
                const email = userId.slice(6).toLowerCase();
                return o.customer.email.toLowerCase() === email;
            }
            return false;
        });
        if (userOrders.length === 0 && !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User not found"
            }, {
                status: 404
            });
        }
        if (!user && userOrders.length > 0) {
            const first = userOrders[0];
            const c = first.customer;
            const name = (c?.name ?? [
                c?.firstName,
                c?.lastName
            ].filter(Boolean).join(" ").trim()) || "—";
            user = {
                id: userId,
                name: name || (c?.email ?? ""),
                email: c?.email ?? ""
            };
        }
        const orders = userOrders.map((o)=>{
            const items = o.items ? o.items : enrichOrderItems(o.products || []);
            const totalPrice = o.totalPrice ?? o.total ?? 0;
            return {
                _id: o._id ?? o.id ?? `legacy-${Date.now()}`,
                items,
                totalPrice,
                status: o.status ?? "pending",
                createdAt: o.createdAt ?? new Date().toISOString()
            };
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            orders
        });
    } catch (e) {
        console.error("Admin user orders API error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch orders"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b3ba6f37._.js.map
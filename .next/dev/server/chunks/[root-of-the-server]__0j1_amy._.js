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
"[project]/Documents/GitHub/AURE-LIEN-/lib/connectDB.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/AURE-LIEN-/node_modules/mongoose)");
;
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
const opts = {
    bufferCommands: false
};
const LOCAL_MONGODB_URI = "mongodb://127.0.0.1:27017/luxuryshop";
function getMongoUri() {
    const configuredUri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
    if (configuredUri) {
        if (configuredUri.startsWith("mongodb://") || configuredUri.startsWith("mongodb+srv://")) {
            return configuredUri;
        }
        throw new Error('Invalid MongoDB connection string. Expected it to start with "mongodb://" or "mongodb+srv://".');
    }
    if ("TURBOPACK compile-time truthy", 1) {
        return LOCAL_MONGODB_URI;
    }
    //TURBOPACK unreachable
    ;
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const mongoUri = getMongoUri();
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["default"].connect(mongoUri, opts).then((mongooseInstance)=>{
            console.log("MongoDB connected");
            return mongooseInstance.connection;
        }).catch((error)=>{
            console.error("MongoDB connection error:", error);
            cached.conn = null;
            cached.promise = null;
            throw error;
        });
    }
    try {
        cached.conn = await cached.promise;
        console.log("MongoDB connection established");
        return cached.conn;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}
}),
"[project]/Documents/GitHub/AURE-LIEN-/models/order.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/AURE-LIEN-/node_modules/mongoose)");
;
const orderItemSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["Schema"]({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
        default: ""
    },
    size: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: null
    }
}, {
    _id: false
});
const legacyProductSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["Schema"]({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
        default: ""
    },
    size: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: null
    }
}, {
    _id: false
});
const customerSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["Schema"]({
    email: {
        type: String,
        default: ""
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    apartment: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    postalCode: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    shippingMethod: {
        type: String,
        default: ""
    },
    shippingCost: {
        type: Number,
        default: 0
    }
}, {
    _id: false
});
const orderSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["Schema"]({
    _id: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    items: {
        type: [
            orderItemSchema
        ],
        default: []
    },
    products: {
        type: [
            legacyProductSchema
        ],
        default: []
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    customer: {
        type: customerSchema,
        default: {}
    }
}, {
    minimize: false
});
const Order = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["models"].Order || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["model"])("Order", orderSchema);
const __TURBOPACK__default__export__ = Order;
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/orderStorage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appendOrder",
    ()=>appendOrder,
    "getOrdersDataJson",
    ()=>getOrdersDataJson,
    "getOrdersJson",
    ()=>getOrdersJson,
    "removeOrderById",
    ()=>removeOrderById,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/connectDB.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/models/order.ts [app-route] (ecmascript)");
;
;
;
;
const BLOB_ORDERS_PATH = "orders.json";
const BLOB_ORDERS_DATA_PATH = "ordersData.json";
function useMongoStorage() {
    const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
    return Boolean(uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")));
}
function useCloudStorage() {
    return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" && process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}
function normalizeOrder(order) {
    const items = Array.isArray(order?.items) ? order.items : [];
    const products = Array.isArray(order?.products) ? order.products : items.map((item)=>({
            _id: item.productId ?? item._id,
            name: item.name ?? "",
            price: Number(item.price ?? 0),
            quantity: Number(item.quantity ?? 1),
            image: item.image ?? "",
            size: item.size ?? null,
            color: item.color ?? null
        }));
    const customer = order?.customer ?? order?.customerInfo ?? {};
    const orderId = String(order?._id ?? order?.id ?? `order-${Date.now()}`);
    const createdAt = order?.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString();
    return {
        _id: orderId,
        id: String(order?.id ?? orderId),
        userId: String(order?.userId ?? customer.email ?? "guest"),
        items: items.map((item)=>({
                productId: String(item.productId ?? item._id ?? ""),
                name: item.name ?? "",
                price: Number(item.price ?? 0),
                quantity: Number(item.quantity ?? 1),
                image: item.image ?? "",
                size: item.size ?? null,
                color: item.color ?? null
            })),
        products: products.map((item)=>({
                _id: String(item._id ?? item.productId ?? ""),
                name: item.name ?? "",
                price: Number(item.price ?? 0),
                quantity: Number(item.quantity ?? 1),
                image: item.image ?? "",
                size: item.size ?? null,
                color: item.color ?? null
            })),
        totalPrice: Number(order?.totalPrice ?? order?.total ?? 0),
        total: Number(order?.total ?? order?.totalPrice ?? 0),
        status: order?.status ?? "pending",
        createdAt,
        customer: {
            email: customer.email ?? "",
            firstName: customer.firstName ?? "",
            lastName: customer.lastName ?? "",
            name: customer.name ?? [
                customer.firstName,
                customer.lastName
            ].filter(Boolean).join(" ").trim(),
            phone: customer.phone ?? "",
            address: customer.address ?? "",
            apartment: customer.apartment ?? "",
            city: customer.city ?? "",
            postalCode: customer.postalCode ?? customer.zipCode ?? "",
            country: customer.country ?? "",
            newsletter: Boolean(customer.newsletter),
            shippingMethod: customer.shippingMethod ?? "",
            shippingCost: Number(customer.shippingCost ?? 0)
        }
    };
}
function toOrdersDataRecord(order) {
    const normalized = normalizeOrder(order);
    return {
        id: normalized.id,
        status: normalized.status,
        products: normalized.products.map((item)=>({
                _id: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                size: item.size,
                color: item.color
            })),
        totalPrice: normalized.totalPrice,
        total: normalized.total,
        user: {
            name: normalized.customer.name,
            email: normalized.customer.email,
            phone: normalized.customer.phone,
            address: [
                normalized.customer.address,
                normalized.customer.apartment
            ].filter(Boolean).join(", "),
            city: normalized.customer.city,
            postalCode: normalized.customer.postalCode,
            country: normalized.customer.country
        },
        customer: normalized.customer,
        userId: normalized.userId,
        createdAt: normalized.createdAt
    };
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
    if (useMongoStorage()) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).sort({
            createdAt: -1
        }).lean();
        return orders.map(normalizeOrder);
    }
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
async function appendOrder(order) {
    const normalized = normalizeOrder(order);
    if (useMongoStorage()) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            _id: normalized._id
        }, normalized, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        return normalized;
    }
    const orders = await getOrdersJson();
    orders.push(normalized);
    await setOrdersJson(orders);
    return normalized;
}
async function removeOrderById(orderId, userId) {
    if (useMongoStorage()) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const filter = userId ? {
            _id: orderId,
            userId
        } : {
            _id: orderId
        };
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteOne(filter);
        return result.deletedCount > 0;
    }
    const orders = await getOrdersJson();
    const filtered = orders.filter((order)=>{
        const normalized = normalizeOrder(order);
        if (normalized._id !== orderId) return true;
        if (userId && normalized.userId !== userId) return true;
        return false;
    });
    if (filtered.length === orders.length) {
        return false;
    }
    await setOrdersJson(filtered);
    return true;
}
async function getOrdersDataJson() {
    if (useMongoStorage()) {
        const orders = await getOrdersJson();
        return orders.map(toOrdersDataRecord);
    }
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
    if (useMongoStorage()) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const normalized = orders.map(normalizeOrder);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
        if (normalized.length > 0) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].insertMany(normalized, {
                ordered: true
            });
        }
        return;
    }
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
    if (useMongoStorage()) {
        // ordersData is derived from the primary orders collection when Mongo is enabled.
        return;
    }
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
"[project]/Documents/GitHub/AURE-LIEN-/app/api/admin/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
;
;
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
        let users = [];
        try {
            const usersData = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].users, "utf-8");
            users = JSON.parse(usersData);
        } catch  {
        // users.json missing or empty (e.g. on serverless) — we'll build from orders
        }
        const orders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$orderStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrdersJson"])();
        // Build map: email (lowercase) -> { _id, name, email, createdAt, orders count, totalSpent }
        const byEmail = new Map();
        for (const u of users){
            const key = u.email.toLowerCase().trim();
            if (!key) continue;
            const userOrders = orders.filter((o)=>o.userId === u.id || o.customer?.email && o.customer.email.toLowerCase().trim() === key);
            const totalSpent = userOrders.reduce((sum, o)=>sum + (Number(o.totalPrice ?? o.total) || 0), 0);
            byEmail.set(key, {
                _id: u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt,
                orders: userOrders.length,
                totalSpent
            });
        }
        // Add everyone who placed an order (with or without account) so all data appears in Admin Users
        for (const o of orders){
            const email = o.customer?.email?.toLowerCase().trim();
            if (!email) continue;
            const orderTotal = Number(o.totalPrice ?? o.total) || 0;
            const existing = byEmail.get(email);
            if (existing) {
                if (existing._id.startsWith("order-")) {
                    existing.orders += 1;
                    existing.totalSpent += orderTotal;
                }
                continue;
            }
            const rawName = o.customer?.name || [
                o.customer?.firstName,
                o.customer?.lastName
            ].filter(Boolean).join(" ").trim();
            const name = rawName && rawName !== "—" ? rawName : `Guest (${o.customer?.email ?? email})`;
            const createdAt = o.createdAt ?? new Date().toISOString();
            byEmail.set(email, {
                _id: `order-${email}`,
                name,
                email: o.customer?.email ?? email,
                createdAt,
                orders: 1,
                totalSpent: orderTotal
            });
        }
        let result = Array.from(byEmail.values());
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search")?.toLowerCase().trim();
        const sort = searchParams.get("sort") || "newest";
        if (search) {
            result = result.filter((u)=>u.email.toLowerCase().includes(search) || u.name.toLowerCase().includes(search));
        }
        if (sort === "newest") {
            result.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === "orders") {
            result.sort((a, b)=>b.orders - a.orders);
        } else if (sort === "spent") {
            result.sort((a, b)=>b.totalSpent - a.totalSpent);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (e) {
        console.error("Admin users API error:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch users"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0j1_amy._.js.map
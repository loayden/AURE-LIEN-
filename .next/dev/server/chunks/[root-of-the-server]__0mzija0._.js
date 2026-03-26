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
function sortOrdersByDateDesc(orders) {
    return [
        ...orders
    ].sort((a, b)=>new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
}
function mergeOrders(primary, secondary) {
    const byId = new Map();
    for (const order of secondary.map(normalizeOrder)){
        byId.set(order._id, order);
    }
    for (const order of primary.map(normalizeOrder)){
        byId.set(order._id, order);
    }
    return sortOrdersByDateDesc(Array.from(byId.values()));
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
async function readOrderSnapshots() {
    if (!useCloudStorage()) {
        return readLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].orders);
    }
    try {
        const text = await readBlobByPathname(BLOB_ORDERS_PATH);
        if (!text) return [];
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [];
    } catch  {
        return [];
    }
}
async function writeOrderSnapshots(orders) {
    const normalized = sortOrdersByDateDesc(orders.map(normalizeOrder));
    const ordersData = normalized.map(toOrdersDataRecord);
    if (!useCloudStorage()) {
        await writeLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].orders, normalized);
        await writeLocalJson(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].ordersData, ordersData);
        return;
    }
    const { put } = await __turbopack_context__.A("[project]/Documents/GitHub/AURE-LIEN-/node_modules/@vercel/blob/dist/index.js [app-route] (ecmascript, async loader)");
    await Promise.all([
        put(BLOB_ORDERS_PATH, JSON.stringify(normalized, null, 2), {
            access: "public",
            contentType: "application/json"
        }),
        put(BLOB_ORDERS_DATA_PATH, JSON.stringify(ordersData, null, 2), {
            access: "public",
            contentType: "application/json"
        })
    ]);
}
async function readMongoOrders() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).sort({
        createdAt: -1
    }).lean();
    return orders.map(normalizeOrder);
}
async function syncOrderSnapshotsFromMongo(excludedOrderIds = []) {
    const mongoOrders = await readMongoOrders();
    const snapshotOrders = (await readOrderSnapshots()).filter((order)=>!excludedOrderIds.includes(normalizeOrder(order)._id));
    const merged = mergeOrders(mongoOrders, snapshotOrders);
    await writeOrderSnapshots(merged);
    return merged;
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
    const snapshotOrders = await readOrderSnapshots();
    if (useMongoStorage()) {
        try {
            const mongoOrders = await readMongoOrders();
            return mergeOrders(mongoOrders, snapshotOrders);
        } catch  {
            return snapshotOrders;
        }
    }
    return snapshotOrders;
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
        await syncOrderSnapshotsFromMongo();
        return normalized;
    }
    const orders = await readOrderSnapshots();
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
        if (result.deletedCount > 0) {
            await syncOrderSnapshotsFromMongo([
                orderId
            ]);
        }
        return result.deletedCount > 0;
    }
    const orders = await readOrderSnapshots();
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
    const orders = await getOrdersJson();
    return orders.map(toOrdersDataRecord);
}
async function setOrdersJson(orders) {
    const normalized = sortOrdersByDateDesc(orders.map(normalizeOrder));
    if (useMongoStorage()) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        if (normalized.length === 0) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            await writeOrderSnapshots([]);
            return;
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
            _id: {
                $nin: normalized.map((order)=>order._id)
            }
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$order$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].bulkWrite(normalized.map((order)=>({
                replaceOne: {
                    filter: {
                        _id: order._id
                    },
                    replacement: order,
                    upsert: true
                }
            })));
        await writeOrderSnapshots(normalized);
        return;
    }
    await writeOrderSnapshots(normalized);
}
async function setOrdersDataJson(ordersData) {
    if (useMongoStorage()) {
        await writeOrderSnapshots(ordersData.map((record)=>({
                id: record.id,
                _id: record.id,
                userId: record.userId,
                products: record.products,
                totalPrice: record.totalPrice ?? record.total,
                total: record.total ?? record.totalPrice,
                status: record.status,
                createdAt: record.createdAt,
                customer: record.customer ?? record.user
            })));
        return;
    }
    const orders = ordersData.map((record)=>({
            id: record.id,
            _id: record.id,
            userId: record.userId,
            products: record.products,
            totalPrice: record.totalPrice ?? record.total,
            total: record.total ?? record.totalPrice,
            status: record.status,
            createdAt: record.createdAt,
            customer: record.customer ?? record.user
        }));
    await writeOrderSnapshots(orders);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0mzija0._.js.map
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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/userSession.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "USER_ID_COOKIE",
    ()=>USER_ID_COOKIE,
    "attachUserCookie",
    ()=>attachUserCookie,
    "getOrCreateUserId",
    ()=>getOrCreateUserId,
    "jsonWithUserCookie",
    ()=>jsonWithUserCookie
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const USER_ID_COOKIE = "cc_uid";
function getOrCreateUserId(req) {
    const existing = req.cookies.get(USER_ID_COOKIE)?.value;
    if (existing) return {
        userId: existing,
        isNew: false
    };
    return {
        userId: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
        isNew: true
    };
}
function attachUserCookie(res, userId) {
    res.cookies.set({
        name: USER_ID_COOKIE,
        value: userId,
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/"
    });
}
function jsonWithUserCookie(req, body, init) {
    const { userId, isNew } = getOrCreateUserId(req);
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(body, init);
    if (isNew) attachUserCookie(res, userId);
    return {
        res,
        userId
    };
}
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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/Documents/GitHub/AURE-LIEN-/app/api/saveorder/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/userSession.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
;
const redis = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"].fromEnv();
async function resolveUserId(req) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(req);
    if (auth?.userId) return {
        userId: auth.userId,
        isNew: false
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrCreateUserId"])(req);
}
async function getOrdersFromRedis() {
    try {
        const ordersJson = await redis.get("orders");
        if (!ordersJson) return [];
        return JSON.parse(ordersJson);
    } catch (error) {
        console.warn("⚠️ Failed to read orders from Redis:", error);
        return [];
    }
}
async function saveOrdersToRedis(orders) {
    try {
        await redis.set("orders", JSON.stringify(orders));
        console.log("✅ Orders saved to Redis");
    } catch (error) {
        console.error("❌ Failed to save orders to Redis:", error);
        throw error;
    }
}
async function POST(req) {
    try {
        const { userId, isNew } = await resolveUserId(req);
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("❌ Invalid JSON in saveorder POST:", parseError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid request body - must be valid JSON"
            }, {
                status: 400
            });
        }
        const { items = [], total = 0, customerInfo = {} } = body;
        console.log("📥 Received order data:", {
            itemsCount: items.length,
            total,
            customerEmail: customerInfo.email
        });
        // ✅ VALIDATION: Check items array
        if (!Array.isArray(items)) {
            console.error("❌ Items is not an array:", typeof items);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Items must be an array"
            }, {
                status: 400
            });
        }
        if (items.length === 0) {
            console.warn("❌ Order contains no items");
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Order must contain at least one item"
            }, {
                status: 400
            });
        }
        // ✅ VALIDATION: Check customer info
        if (!customerInfo.email || !customerInfo.name || !customerInfo.address) {
            console.error("❌ Missing required customer information:", {
                hasEmail: !!customerInfo.email,
                hasName: !!customerInfo.name,
                hasAddress: !!customerInfo.address
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required customer information"
            }, {
                status: 400
            });
        }
        // ✅ VALIDATION: Validate each item
        for (const item of items){
            if (!item.productId || !item.name || !item.price || !item.quantity) {
                console.error("❌ Invalid item structure:", item);
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Each item must have productId, name, price, and quantity"
                }, {
                    status: 400
                });
            }
            if (item.quantity < 1) {
                console.error("❌ Invalid quantity:", item.quantity);
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Item quantity must be at least 1"
                }, {
                    status: 400
                });
            }
            if (item.price < 0) {
                console.error("❌ Invalid price:", item.price);
                return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Item price cannot be negative"
                }, {
                    status: 400
                });
            }
        }
        // ✅ VALIDATION: Validate total
        if (typeof total !== "number" || total < 0) {
            console.error("❌ Invalid total:", total);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Total must be a positive number"
            }, {
                status: 400
            });
        }
        // ✅ CALCULATE TOTAL SERVER-SIDE (don't trust frontend)
        const calculatedTotal = items.reduce((sum, item)=>{
            return sum + item.price * item.quantity;
        }, 0);
        console.log(`✅ Total validation: frontend=${total.toFixed(2)}, server=${calculatedTotal.toFixed(2)}`);
        // Allow small rounding differences (cents)
        if (Math.abs(calculatedTotal - total) > 0.01) {
            console.warn(`⚠️ Total mismatch - using server-calculated total`);
        }
        // ✅ Step 1: Read existing orders from Redis
        let orders = [];
        try {
            orders = await getOrdersFromRedis();
            console.log(`✅ Read ${orders.length} existing orders from Redis`);
        } catch (readError) {
            console.error("❌ Failed to read orders from Redis:", readError instanceof Error ? readError.message : String(readError));
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to read orders database"
            }, {
                status: 500
            });
        }
        // ✅ Step 2: Create new order
        const newOrder = {
            _id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId,
            items: items.map((item)=>({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size || "One Size",
                    color: item.color || "Default",
                    image: item.image || ""
                })),
            total: calculatedTotal,
            customerInfo: {
                email: customerInfo.email,
                name: customerInfo.name,
                address: customerInfo.address,
                city: customerInfo.city || "",
                state: customerInfo.state || "",
                zipCode: customerInfo.zipCode || "",
                phone: customerInfo.phone || ""
            },
            createdAt: new Date().toISOString(),
            status: "pending"
        };
        console.log(`✅ Created new order ${newOrder._id} with ${items.length} items`);
        orders.push(newOrder);
        // ✅ Step 3: Write updated orders back to Redis
        try {
            await saveOrdersToRedis(orders);
            console.log(`✅ Order ${newOrder._id} saved successfully to Redis`);
        } catch (writeError) {
            console.error("❌ Failed to save order to Redis:", writeError instanceof Error ? writeError.message : String(writeError));
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to save order to database"
            }, {
                status: 500
            });
        }
        // ✅ Step 4: Send confirmation email (non-blocking)
        try {
            fetch(`${req.nextUrl.origin}/api/email/send-order-confirmation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId: newOrder._id,
                    email: customerInfo.email,
                    items,
                    total: calculatedTotal
                })
            }).catch((err)=>console.warn("⚠️ Email send failed (non-blocking):", err));
            console.log(`✅ Email send initiated for order ${newOrder._id}`);
        } catch (emailError) {
            console.warn("⚠️ Email scheduling failed:", emailError);
        // Don't return error - email is non-critical
        }
        // ✅ Return success
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            orderId: newOrder._id,
            message: "Order placed successfully",
            total: calculatedTotal,
            itemsCount: items.length
        }, {
            status: 201
        });
        if (isNew) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachUserCookie"])(res, userId);
        return res;
    } catch (error) {
        console.error("❌ Saveorder POST error:", error instanceof Error ? error.message : String(error));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to place order. Please try again."
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    try {
        const { userId } = await resolveUserId(req);
        let orders = [];
        try {
            orders = await getOrdersFromRedis();
        } catch (readError) {
            console.error("❌ Failed to read orders from Redis:", readError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                orders: [],
                error: "Failed to fetch orders"
            }, {
                status: 200
            });
        }
        // Filter orders for this user
        const userOrders = orders.filter((o)=>o.userId === userId);
        console.log(`✅ Retrieved ${userOrders.length} orders for user ${userId}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            orders: userOrders
        }, {
            status: 200
        });
    } catch (error) {
        console.error("❌ Saveorder GET error:", error instanceof Error ? error.message : String(error));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            orders: [],
            error: "Failed to fetch orders"
        }, {
            status: 200
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0qvuuml._.js.map
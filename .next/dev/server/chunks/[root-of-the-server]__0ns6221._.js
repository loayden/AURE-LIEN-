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
"[project]/Documents/GitHub/AURE-LIEN-/lib/redisStorage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllDrafts",
    ()=>clearAllDrafts,
    "deleteUserDraft",
    ()=>deleteUserDraft,
    "getDraftsJson",
    ()=>getDraftsJson,
    "getUserDraft",
    ()=>getUserDraft,
    "saveUserDraft",
    ()=>saveUserDraft,
    "setDraftsJson",
    ()=>setDraftsJson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
;
const redis = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"].fromEnv();
const DRAFTS_KEY_PREFIX = 'drafts:';
async function getDraftsJson() {
    try {
        const allDrafts = await redis.hgetall('drafts');
        return allDrafts || {};
    } catch (error) {
        console.error('❌ Error reading drafts from Redis:', error instanceof Error ? error.message : String(error));
        return {};
    }
}
async function setDraftsJson(drafts) {
    try {
        // Clear existing drafts
        await redis.del('drafts');
        // Set new drafts using HSET (hash set)
        if (Object.keys(drafts).length > 0) {
            const flatDrafts = {};
            for (const [key, value] of Object.entries(drafts)){
                flatDrafts[key] = JSON.stringify(value);
            }
            await redis.hset('drafts', flatDrafts);
        }
        console.log('✅ Drafts saved to Redis successfully');
    } catch (error) {
        console.error('❌ Failed to write drafts to Redis:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
async function getUserDraft(userId) {
    try {
        const draftJson = await redis.hget('drafts', userId);
        if (!draftJson) return null;
        return JSON.parse(draftJson);
    } catch (error) {
        console.error(`❌ Error fetching draft for user ${userId}:`, error instanceof Error ? error.message : String(error));
        return null;
    }
}
async function saveUserDraft(userId, draft) {
    try {
        const draftWithTimestamp = {
            ...draft,
            updatedAt: new Date().toISOString()
        };
        await redis.hset('drafts', {
            [userId]: JSON.stringify(draftWithTimestamp)
        });
        console.log(`✅ Draft saved for user ${userId}`);
    } catch (error) {
        console.error(`❌ Error saving draft for user ${userId}:`, error instanceof Error ? error.message : String(error));
        throw error;
    }
}
async function deleteUserDraft(userId) {
    try {
        await redis.hdel('drafts', userId);
        console.log(`✅ Draft deleted for user ${userId}`);
    } catch (error) {
        console.error(`❌ Error deleting draft for user ${userId}:`, error instanceof Error ? error.message : String(error));
        throw error;
    }
}
async function clearAllDrafts() {
    try {
        await redis.del('drafts');
        console.log('✅ All drafts cleared from Redis');
    } catch (error) {
        console.error('❌ Error clearing all drafts:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
}),
"[project]/Documents/GitHub/AURE-LIEN-/app/api/checkout-draft/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/userSession.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$redisStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/redisStorage.ts [app-route] (ecmascript)");
;
;
;
;
;
async function resolveUserId(req) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(req);
    if (auth?.userId) return {
        userId: auth.userId,
        isNew: false
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrCreateUserId"])(req);
}
async function GET(req) {
    try {
        const { userId, isNew } = await resolveUserId(req);
        let drafts = {};
        try {
            drafts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$redisStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDraftsJson"])();
        } catch (storageError) {
            console.warn("⚠️ Failed to read drafts from Redis:", storageError);
            drafts = {};
        }
        const draft = drafts[userId] || null;
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            draft
        }, {
            status: 200
        });
        if (isNew) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachUserCookie"])(res, userId);
        return res;
    } catch (e) {
        console.error("❌ Checkout draft GET error:", e instanceof Error ? e.message : String(e));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            draft: null,
            error: "Failed to fetch draft"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const { userId, isNew } = await resolveUserId(req);
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("❌ Invalid JSON in checkout draft POST:", parseError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid request body - must be valid JSON"
            }, {
                status: 400
            });
        }
        const { items = [], form = {} } = body;
        if (!Array.isArray(items)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Items must be an array"
            }, {
                status: 400
            });
        }
        if (typeof form !== "object" || form === null) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Form must be an object"
            }, {
                status: 400
            });
        }
        let drafts = {};
        try {
            drafts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$redisStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDraftsJson"])();
        } catch (storageError) {
            console.warn("⚠️ Failed to read existing drafts from Redis:", storageError);
            drafts = {};
        }
        drafts[userId] = {
            items: items,
            form: form,
            updatedAt: new Date().toISOString()
        };
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$redisStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setDraftsJson"])(drafts);
        } catch (writeError) {
            console.error("❌ Failed to write drafts to Redis:", writeError instanceof Error ? writeError.message : String(writeError));
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to save draft to storage"
            }, {
                status: 500
            });
        }
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            userId
        }, {
            status: 200
        });
        if (isNew) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachUserCookie"])(res, userId);
        return res;
    } catch (e) {
        console.error("❌ Checkout draft POST error:", e instanceof Error ? e.message : String(e));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to save draft"
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        const { userId, isNew } = await resolveUserId(req);
        let drafts = {};
        try {
            drafts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$redisStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDraftsJson"])();
        } catch (storageError) {
            console.warn("⚠️ Failed to read drafts for deletion from Redis:", storageError);
            const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            }, {
                status: 200
            });
            if (isNew) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachUserCookie"])(res, userId);
            return res;
        }
        delete drafts[userId];
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$redisStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setDraftsJson"])(drafts);
        } catch (writeError) {
            console.error("❌ Failed to delete draft from Redis:", writeError instanceof Error ? writeError.message : String(writeError));
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to delete draft"
            }, {
                status: 500
            });
        }
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        }, {
            status: 200
        });
        if (isNew) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$userSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["attachUserCookie"])(res, userId);
        return res;
    } catch (e) {
        console.error("❌ Checkout draft DELETE error:", e instanceof Error ? e.message : String(e));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to clear draft"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ns6221._.js.map
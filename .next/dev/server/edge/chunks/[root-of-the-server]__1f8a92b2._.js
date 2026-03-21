(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__1f8a92b2._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/auth-edge.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyTokenEdge",
    ()=>verifyTokenEdge
]);
/**
 * Edge-safe JWT verify for middleware (uses Web Crypto via jose).
 * Signing stays in lib/auth.ts with jsonwebtoken (Node only).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/jose/dist/browser/jwt/verify.js [middleware-edge] (ecmascript)");
;
const JWT_SECRET = process.env.JWT_SECRET || "luxury-secret-change-in-production";
async function verifyTokenEdge(token) {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$jose$2f$dist$2f$browser$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret);
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };
    } catch  {
        return null;
    }
}
}),
"[project]/Documents/GitHub/AURE-LIEN-/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2d$edge$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/auth-edge.ts [middleware-edge] (ecmascript)");
;
;
const protectedPaths = [
    "/account",
    "/wishlist",
    "/orders"
];
const adminPaths = [
    "/admin"
];
async function middleware(req) {
    const token = req.cookies.get("auth_token")?.value;
    const payload = token ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2d$edge$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifyTokenEdge"])(token) : null;
    const path = req.nextUrl.pathname;
    if (adminPaths.some((p)=>path.startsWith(p))) {
        if (!payload) {
            const login = new URL("/login", req.url);
            login.searchParams.set("redirect", path);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(login);
        }
        if (payload.role !== "admin") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", req.url));
        }
    }
    if (protectedPaths.some((p)=>path.startsWith(p))) {
        if (!payload) {
            const login = new URL("/login", req.url);
            login.searchParams.set("redirect", path);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(login);
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/account/:path*",
        "/wishlist/:path*",
        "/orders/:path*",
        "/admin/:path*"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1f8a92b2._.js.map
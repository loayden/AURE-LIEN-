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
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    // Use MONGO_URI in .env (not MONGODB_URI) for consistency with this codebase
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["default"].connect(process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/luxuryshop", opts).then((mongooseInstance)=>{
            console.log("MongoDB connected");
            return mongooseInstance.connection;
        }).catch((error)=>{
            console.error("MongoDB connection error:", error);
            cached.conn = null;
            cached.promise = null;
            throw new Error("Failed to connect to MongoDB");
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
"[project]/Documents/GitHub/AURE-LIEN-/models/Wishlist.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/AURE-LIEN-/node_modules/mongoose)");
;
const productDataSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["Schema"]({
    _id: String,
    name: String,
    price: Number,
    images: [
        String
    ],
    category: String
}, {
    _id: false
});
const wishlistSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["Schema"]({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    productData: {
        type: productDataSchema,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
wishlistSchema.index({
    userId: 1,
    productId: 1
}, {
    unique: true
});
const Wishlist = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["models"].Wishlist || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["model"])("Wishlist", wishlistSchema);
const __TURBOPACK__default__export__ = Wishlist;
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/wishlistMongo.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToWishlistMongo",
    ()=>addToWishlistMongo,
    "getWishlistByUserMongo",
    ()=>getWishlistByUserMongo,
    "removeFromWishlistMongo",
    ()=>removeFromWishlistMongo
]);
/**
 * MongoDB wishlist with product data embedded
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/connectDB.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$Wishlist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/models/Wishlist.ts [app-route] (ecmascript)");
;
;
async function getWishlistByUserMongo(userId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const items = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$Wishlist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
        userId
    }).sort({
        createdAt: -1
    }).lean();
    return items.map((i)=>({
            productId: i.productId,
            productData: i.productData || null
        }));
}
async function addToWishlistMongo(userId, productId, productData) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$Wishlist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
        userId,
        productId
    }, {
        $set: {
            userId,
            productId,
            ...productData && {
                productData
            },
            createdAt: new Date()
        }
    }, {
        upsert: true
    });
}
async function removeFromWishlistMongo(userId, productId) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$Wishlist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteOne({
        userId,
        productId
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
"[project]/Documents/GitHub/AURE-LIEN-/app/api/wishlist/list/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$wishlistMongo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/wishlistMongo.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/productsData.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(req) {
    try {
        const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthFromRequest"])(req);
        // Not logged in - return empty wishlist with 200
        if (!auth || !auth.userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items: [],
                message: "Not authenticated"
            }, {
                status: 200
            });
        }
        try {
            const entries = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$wishlistMongo$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWishlistByUserMongo"])(auth.userId);
            const items = entries.map((e)=>{
                if (e.productData && e.productData._id) {
                    const { _id, ...rest } = e.productData;
                    return {
                        _id,
                        ...rest
                    };
                }
                const p = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find((x)=>String(x._id) === String(e.productId));
                return p || {
                    _id: e.productId
                };
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items
            }, {
                status: 200
            });
        } catch (mongoError) {
            console.error("❌ Wishlist MongoDB error for user", auth.userId, ":", mongoError instanceof Error ? mongoError.message : String(mongoError));
            // Return empty list instead of 500
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                items: [],
                error: "Failed to fetch wishlist"
            }, {
                status: 200
            });
        }
    } catch (error) {
        console.error("❌ Wishlist list error:", error instanceof Error ? error.message : String(error));
        // Return empty list on error instead of 500 for better UX
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            items: [],
            error: "Failed to fetch wishlist"
        }, {
            status: 200
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0q-dyc~._.js.map
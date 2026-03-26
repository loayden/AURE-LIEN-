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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
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
"[project]/Documents/GitHub/AURE-LIEN-/models/Product.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/AURE-LIEN-/node_modules/mongoose)");
;
const ProductSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["default"].Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [
            String
        ],
        default: []
    },
    size: {
        type: [
            String
        ],
        default: []
    },
    colors: {
        type: [
            String
        ],
        default: []
    },
    description: {
        type: String
    },
    material: {
        type: String
    },
    stock: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["default"].models.Product || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$mongoose$29$__["default"].model("Product", ProductSchema);
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
"[project]/Documents/GitHub/AURE-LIEN-/lib/productsJson.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appendProductJson",
    ()=>appendProductJson,
    "readProductsJson",
    ()=>readProductsJson
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/dataPaths.ts [app-route] (ecmascript)");
;
;
async function readProductsJson() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].products, "utf-8");
        return JSON.parse(data);
    } catch  {
        return [];
    }
}
async function appendProductJson(product) {
    const list = await readProductsJson();
    list.push(product);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$dataPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paths"].products, JSON.stringify(list, null, 2));
}
}),
"[project]/Documents/GitHub/AURE-LIEN-/lib/getAllProducts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearProductsCache",
    ()=>clearProductsCache,
    "getAllProducts",
    ()=>getAllProducts,
    "getProductById",
    ()=>getProductById
]);
/**
 * Server-only merged product catalog:
 * - built-in storefront products
 * - JSON-backed admin products
 * - Mongo-backed admin products when DB is configured
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/connectDB.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/models/Product.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/productsData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsJson$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/productsJson.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
const PUBLIC_UPLOADS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "uploads");
const PUBLIC_IMAGES_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "images");
let cache = null;
function hasMongoConfig() {
    const uri = process.env.MONGO_URI?.trim() || process.env.MONGODB_URI?.trim();
    return Boolean(uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")));
}
function normalizeImagePath(image) {
    if (typeof image !== "string") return PLACEHOLDER_IMAGE;
    const trimmed = image.trim();
    if (!trimmed) return PLACEHOLDER_IMAGE;
    if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
        return trimmed;
    }
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(PUBLIC_UPLOADS_DIR, trimmed))) {
        return `/uploads/${trimmed}`;
    }
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(PUBLIC_IMAGES_DIR, trimmed))) {
        return `/images/${trimmed}`;
    }
    return PLACEHOLDER_IMAGE;
}
function normalizeProduct(raw) {
    const images = Array.isArray(raw?.images) ? raw.images.map(normalizeImagePath).filter(Boolean) : [];
    return {
        _id: String(raw?._id ?? ""),
        name: String(raw?.name ?? "").trim(),
        category: String(raw?.category ?? "").trim(),
        price: Number(raw?.price ?? 0),
        images: images.length > 0 ? images : [
            PLACEHOLDER_IMAGE
        ],
        size: Array.isArray(raw?.size) ? raw.size.map((value)=>String(value)) : [],
        colors: Array.isArray(raw?.colors) ? raw.colors.map((value)=>String(value)) : [],
        description: raw?.description ? String(raw.description) : undefined,
        material: raw?.material ? String(raw.material) : undefined,
        stock: typeof raw?.stock === "number" ? raw.stock : undefined,
        media360: Array.isArray(raw?.media360) ? raw.media360.map((value)=>normalizeImagePath(value)) : undefined,
        videoUrl: raw?.videoUrl ? String(raw.videoUrl) : undefined
    };
}
function mergeProducts(lists) {
    const byId = new Map();
    for (const list of lists){
        for (const product of list.map(normalizeProduct)){
            if (!product._id) continue;
            byId.set(product._id, product);
        }
    }
    return Array.from(byId.values());
}
async function readMongoProducts() {
    if (!hasMongoConfig()) return [];
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$connectDB$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$models$2f$Product$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}).sort({
            createdAt: -1
        }).lean();
        return products.map(normalizeProduct);
    } catch (error) {
        console.error("Failed to read products from MongoDB:", error);
        return [];
    }
}
async function loadAllProducts() {
    const builtInProducts = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].map(normalizeProduct);
    const fromJson = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsJson$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readProductsJson"])()).map(normalizeProduct);
    const fromMongo = await readMongoProducts();
    return mergeProducts([
        builtInProducts,
        fromJson,
        fromMongo
    ]);
}
async function getAllProducts() {
    if (cache) return cache;
    cache = await loadAllProducts();
    return cache;
}
async function getProductById(id) {
    if (!id) return null;
    const products = await getAllProducts();
    return products.find((product)=>String(product._id) === String(id)) ?? null;
}
function clearProductsCache() {
    cache = null;
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Documents/GitHub/AURE-LIEN-/app/api/products/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$getAllProducts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/getAllProducts.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(req, context) {
    const { id } = await context.params;
    const product = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$getAllProducts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProductById"])(id);
    if (!product) return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Product not found"
    }, {
        status: 404
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(product, {
        status: 200,
        headers: {
            "Cache-Control": "no-store, max-age=0"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08.n_jk._.js.map
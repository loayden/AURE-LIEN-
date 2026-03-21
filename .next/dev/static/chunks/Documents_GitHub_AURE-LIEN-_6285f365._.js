(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const AUTO_MS = 3000;
const badgeStyles = {
    new: {
        bg: "rgba(102, 153, 255, 0.85)",
        text: "#fff",
        label: "New"
    },
    sale: {
        bg: "rgba(255, 102, 102, 0.85)",
        text: "#fff",
        label: "Sale"
    },
    bestseller: {
        bg: "rgba(198, 169, 98, 0.85)",
        text: "#fff",
        label: "Best Seller"
    },
    trending: {
        bg: "rgba(255, 179, 71, 0.85)",
        text: "#fff",
        label: "Trending"
    }
};
// Color name to hex mapping
const COLOR_HEX_MAP = {
    black: "#000000",
    white: "#ffffff",
    cream: "#FFFDD0",
    beige: "#F5F5DC",
    navy: "#001f3f",
    gray: "#808080",
    grey: "#808080",
    brown: "#8B4513",
    camel: "#C19A6B",
    violet: "#EE82EE",
    mocha: "#6F4E37",
    green: "#008000",
    olive: "#808000",
    tan: "#D2B48C",
    sand: "#C2B280",
    charcoal: "#36454F",
    indigo: "#4B0082",
    khaki: "#F0E68C"
};
function getColorHex(colorName) {
    const normalized = colorName.toLowerCase().trim();
    return COLOR_HEX_MAP[normalized] || "#000000";
}
function ProductCard({ product, className = "", onWishlistUpdate, showRemoveFromWishlist }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [direction, setDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inWishlist, setInWishlist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [added, setAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSize, setSelectedSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedColor, setSelectedColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showSizeSelector, setShowSizeSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showColorSelector, setShowColorSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const images = (product.images || []).filter((img)=>typeof img === "string" && img.trim() !== "");
    const count = images.length;
    // Get sizes (handle both size and sizes fields)
    const sizes = product.sizes || product.size || [];
    // Normalize colors to ColorOption[]
    const normalizedColors = (()=>{
        const colorData = product.colors;
        if (!colorData || !Array.isArray(colorData)) return [];
        return colorData.map((color)=>{
            if (typeof color === "string") {
                return {
                    name: color,
                    hex: getColorHex(color)
                };
            }
            return color;
        });
    })();
    const isLowStock = (product.stock ?? 10) < 5;
    const outOfStock = (product.stock ?? 1) === 0;
    /* ── Auto-advance ── */ const goTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProductCard.useCallback[goTo]": (idx, dir)=>{
            const next = (idx + count) % count;
            setDirection(dir ?? (next > current ? 1 : -1));
            setCurrent(next);
        }
    }["ProductCard.useCallback[goTo]"], [
        count,
        current
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductCard.useEffect": ()=>{
            if (count < 2 || paused) return;
            const t = setTimeout({
                "ProductCard.useEffect.t": ()=>goTo(current + 1, 1)
            }["ProductCard.useEffect.t"], AUTO_MS);
            return ({
                "ProductCard.useEffect": ()=>clearTimeout(t)
            })["ProductCard.useEffect"];
        }
    }["ProductCard.useEffect"], [
        current,
        paused,
        count,
        goTo
    ]);
    /* ── Touch ── */ const tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0), ty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0), sg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    function onTouchStart(e) {
        tx.current = e.touches[0].clientX;
        ty.current = e.touches[0].clientY;
        sg.current = null;
        setPaused(true);
    }
    function onTouchMove(e) {
        const dx = e.touches[0].clientX - tx.current, dy = e.touches[0].clientY - ty.current;
        if (sg.current === null) sg.current = Math.abs(dy) > Math.abs(dx);
        if (!sg.current) e.preventDefault();
    }
    function onTouchEnd(e) {
        if (sg.current) {
            setPaused(false);
            return;
        }
        const dx = e.changedTouches[0].clientX - tx.current;
        if (Math.abs(dx) > 36) goTo(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        setTimeout(()=>setPaused(false), 4000);
    }
    /* ── Mouse drag ── */ const dx0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    function onMouseDown(e) {
        dx0.current = e.clientX;
        setDragging(false);
        setPaused(true);
    }
    function onMouseUp(e) {
        const d = e.clientX - dx0.current;
        if (Math.abs(d) > 36) {
            goTo(current + (d < 0 ? 1 : -1), d < 0 ? 1 : -1);
            setDragging(true);
        }
        setTimeout(()=>{
            setDragging(false);
            setPaused(false);
        }, 4000);
    }
    /* ── Tilt ── */ const mx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0), my = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const sx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(mx, {
        stiffness: 90,
        damping: 20
    });
    const sy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(my, {
        stiffness: 90,
        damping: 20
    });
    const rX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(sy, {
        "ProductCard.useTransform[rX]": (v)=>(v / (cardRef.current?.offsetHeight ?? 400) - 0.5) * -3
    }["ProductCard.useTransform[rX]"]);
    const rY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(sx, {
        "ProductCard.useTransform[rY]": (v)=>(v / (cardRef.current?.offsetWidth ?? 300) - 0.5) * 3
    }["ProductCard.useTransform[rY]"]);
    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mx.set(clientX - left);
        my.set(clientY - top);
    }
    function onMouseLeave() {
        mx.set(0);
        my.set(0);
        setPaused(false);
    }
    /* ── Wishlist ── */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductCard.useEffect": ()=>{
            fetch("/api/wishlist/list").then({
                "ProductCard.useEffect": (r)=>r.json()
            }["ProductCard.useEffect"]).then({
                "ProductCard.useEffect": (d)=>setInWishlist((d.items || []).some({
                        "ProductCard.useEffect": (p)=>p._id === product._id
                    }["ProductCard.useEffect"]))
            }["ProductCard.useEffect"]).catch({
                "ProductCard.useEffect": ()=>{}
            }["ProductCard.useEffect"]);
        }
    }["ProductCard.useEffect"], [
        product._id
    ]);
    async function toggleWishlist(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            await fetch(inWishlist ? "/api/wishlist/remove" : "/api/wishlist/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product._id
                })
            });
            setInWishlist((v)=>!v);
            if (inWishlist) onWishlistUpdate?.(product._id);
        } catch  {
            router.push("/login");
        }
    }
    async function handleAddToCart(e) {
        e.stopPropagation();
        if (!product._id || outOfStock) return;
        try {
            setLoading(true);
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 1,
                    size: selectedSize,
                    color: selectedColor
                })
            });
            if (!res.ok) throw new Error();
            setAdded(true);
            setTimeout(()=>setAdded(false), 2200);
        } catch  {
            alert("Failed to add to cart.");
        } finally{
            setLoading(false);
        }
    }
    const variants = {
        enter: (d)=>({
                x: d * 24,
                opacity: 0
            }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (d)=>({
                x: d * -24,
                opacity: 0
            })
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: cardRef,
        layout: true,
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.75,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        onClick: ()=>{
            if (!dragging) router.push(`/product/${product._id}`);
        },
        onMouseMove: onMouseMove,
        onMouseLeave: onMouseLeave,
        style: {
            rotateX: rX,
            rotateY: rY,
            transformStyle: "preserve-3d",
            perspective: 900,
            borderRadius: 16,
            boxShadow: "0 1px 0 rgba(255,255,255,0.07), 0 24px 60px rgba(0,0,0,0.50)",
            border: "1px solid rgba(255,255,255,0.07)"
        },
        whileHover: {
            y: -5,
            boxShadow: "0 1px 0 rgba(255,255,255,0.10), 0 36px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(198,169,98,0.08)",
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 26
            }
        },
        className: `group relative w-full flex flex-col overflow-hidden cursor-pointer select-none ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden",
                style: {
                    aspectRatio: "4/5",
                    touchAction: "pan-y"
                },
                onTouchStart: onTouchStart,
                onTouchMove: onTouchMove,
                onTouchEnd: onTouchEnd,
                onMouseDown: onMouseDown,
                onMouseUp: onMouseUp,
                onMouseEnter: ()=>setPaused(true),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        initial: false,
                        custom: direction,
                        mode: "sync",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            custom: direction,
                            variants: variants,
                            initial: "enter",
                            animate: "center",
                            exit: "exit",
                            transition: {
                                duration: 0.48,
                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1
                                ]
                            },
                            className: "absolute inset-0",
                            children: images[current] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: images[current],
                                alt: `${product.name} — ${current + 1}`,
                                fill: true,
                                sizes: "(max-width:640px) 50vw, 25vw",
                                className: "object-cover",
                                draggable: false,
                                priority: current === 0
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 236,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full flex items-center justify-center bg-[#0f0f0f]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white/10 text-[9px] tracking-[0.4em] uppercase",
                                    style: {
                                        fontFamily: "'Jost',sans-serif"
                                    },
                                    children: "No Image"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                    lineNumber: 247,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        }, current, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 pointer-events-none z-10",
                        style: {
                            background: "linear-gradient(to top, rgba(4,4,6,0.92) 0%, rgba(4,4,6,0.18) 38%, transparent 62%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    product.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: -10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "absolute top-3 left-3 z-30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider",
                        style: {
                            background: badgeStyles[product.badge].bg,
                            color: badgeStyles[product.badge].text,
                            backdropFilter: "blur(12px)"
                        },
                        children: badgeStyles[product.badge].label
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this),
                    isLowStock && !outOfStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        className: "absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider",
                        style: {
                            background: "rgba(255, 179, 71, 0.85)",
                            color: "#fff",
                            backdropFilter: "blur(12px)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this),
                            product.stock,
                            " Left"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    outOfStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm",
                            style: {
                                background: "rgba(100, 100, 100, 0.9)",
                                color: "#fff"
                            },
                            children: "Out of Stock"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                            lineNumber: 293,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this),
                    count > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 inset-x-0 z-20 flex gap-[3px] px-4 pb-[14px]",
                        children: images.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    goTo(i, i > current ? 1 : -1);
                                    setPaused(true);
                                    setTimeout(()=>setPaused(false), 4000);
                                },
                                className: "relative flex-1 overflow-hidden",
                                style: {
                                    height: 1.5,
                                    borderRadius: 9999,
                                    background: "rgba(255,255,255,0.15)"
                                },
                                children: i === current && !paused ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: "absolute inset-y-0 left-0 rounded-full",
                                    style: {
                                        background: "rgba(198,169,98,0.85)"
                                    },
                                    initial: {
                                        width: "0%"
                                    },
                                    animate: {
                                        width: "100%"
                                    },
                                    transition: {
                                        duration: AUTO_MS / 1000,
                                        ease: "linear"
                                    }
                                }, `p-${current}`, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                    lineNumber: 312,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-y-0 left-0 rounded-full",
                                    style: {
                                        width: i < current ? "100%" : "0%",
                                        background: i < current ? "rgba(255,255,255,0.45)" : "transparent"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                    lineNumber: 317,
                                    columnNumber: 19
                                }, this)
                            }, i, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 304,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 302,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                        type: "button",
                        onClick: toggleWishlist,
                        className: "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 flex items-center justify-center rounded-full",
                        style: {
                            width: 38,
                            height: 38,
                            background: inWishlist ? "rgba(180,40,40,0.75)" : "rgba(0,0,0,0.42)",
                            backdropFilter: "blur(20px)",
                            border: inWishlist ? "1px solid rgba(255,80,80,0.35)" : "1px solid rgba(255,255,255,0.10)",
                            boxShadow: inWishlist ? "0 0 18px rgba(255,60,60,0.20)" : "none"
                        },
                        whileTap: {
                            scale: 0.8
                        },
                        "aria-label": inWishlist ? "Remove from wishlist" : "Add to wishlist",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                            className: "w-4 h-4 transition-all duration-300",
                            strokeWidth: inWishlist ? 0 : 1.5,
                            style: {
                                color: "#fff",
                                fill: inWishlist ? "#fff" : "none",
                                opacity: inWishlist ? 1 : 0.65
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                            lineNumber: 341,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 px-4 pt-3.5 pb-3 flex flex-col gap-2",
                style: {
                    background: "linear-gradient(170deg, rgba(18,16,12,0.82) 0%, rgba(10,9,8,0.94) 100%)",
                    backdropFilter: "blur(36px) saturate(140%)",
                    WebkitBackdropFilter: "blur(36px) saturate(140%)",
                    borderTop: "1px solid rgba(255,255,255,0.06)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 h-px pointer-events-none",
                        style: {
                            background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.10) 60%, transparent 95%)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-light leading-snug line-clamp-1",
                                style: {
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: "1.0rem",
                                    letterSpacing: "0.055em",
                                    color: "rgba(255,255,255,0.88)"
                                },
                                children: product.name
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this),
                            product.rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-0.5",
                                        children: [
                                            ...Array(5)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                size: 12,
                                                className: "transition-colors",
                                                style: {
                                                    fill: i < Math.floor(product.rating) ? "#C6A962" : "transparent",
                                                    color: "#C6A962",
                                                    opacity: i < Math.floor(product.rating) ? 1 : 0.3
                                                }
                                            }, i, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                                lineNumber: 380,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                        lineNumber: 378,
                                        columnNumber: 15
                                    }, this),
                                    product.reviews && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px]",
                                        style: {
                                            color: "rgba(255,255,255,0.5)"
                                        },
                                        children: [
                                            "(",
                                            product.reviews,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this),
                    product.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[7px] tracking-[0.35em] uppercase",
                        style: {
                            fontFamily: "'Jost', sans-serif",
                            color: "rgba(255,255,255,0.22)"
                        },
                        children: product.category
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 399,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 flex-wrap",
                        children: [
                            sizes && sizes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setShowSizeSelector(!showSizeSelector);
                                },
                                className: "text-[10px] px-2 py-1 rounded-md transition-all",
                                style: {
                                    background: selectedSize ? "rgba(198,169,98,0.3)" : "rgba(255,255,255,0.08)",
                                    color: selectedSize ? "#C6A962" : "rgba(255,255,255,0.6)",
                                    border: selectedSize ? "1px solid rgba(198,169,98,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                    fontFamily: "'Jost', sans-serif",
                                    fontWeight: 600,
                                    letterSpacing: "0.05em"
                                },
                                whileHover: {
                                    scale: 1.05
                                },
                                children: selectedSize || "Size"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this),
                            normalizedColors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setShowColorSelector(!showColorSelector);
                                },
                                className: "w-7 h-7 rounded-md transition-all border",
                                style: {
                                    background: selectedColor || normalizedColors[0].hex,
                                    border: selectedColor ? "2px solid #C6A962" : "1px solid rgba(255,255,255,0.2)",
                                    opacity: 0.8
                                },
                                whileHover: {
                                    scale: 1.1
                                },
                                title: `Color: ${selectedColor || normalizedColors[0].name}`
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 429,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showSizeSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                height: 0
                            },
                            animate: {
                                opacity: 1,
                                height: "auto"
                            },
                            exit: {
                                opacity: 0,
                                height: 0
                            },
                            className: "flex flex-wrap gap-1.5 mt-1 pt-2 border-t border-white/10",
                            onClick: (e)=>e.stopPropagation(),
                            children: sizes.map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        setSelectedSize(size);
                                        setShowSizeSelector(false);
                                    },
                                    className: "text-[9px] px-2 py-1 rounded-md transition-all font-semibold uppercase tracking-wider",
                                    style: {
                                        background: selectedSize === size ? "rgba(198,169,98,0.6)" : "rgba(255,255,255,0.08)",
                                        color: selectedSize === size ? "#fff" : "rgba(255,255,255,0.6)",
                                        border: selectedSize === size ? "1px solid #C6A962" : "1px solid rgba(255,255,255,0.1)"
                                    },
                                    children: size
                                }, size, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                    lineNumber: 457,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                            lineNumber: 449,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 447,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showColorSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                height: 0
                            },
                            animate: {
                                opacity: 1,
                                height: "auto"
                            },
                            exit: {
                                opacity: 0,
                                height: 0
                            },
                            className: "flex flex-wrap gap-2 mt-1 pt-2 border-t border-white/10",
                            onClick: (e)=>e.stopPropagation(),
                            children: normalizedColors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        setSelectedColor(color.hex);
                                        setShowColorSelector(false);
                                    },
                                    className: "w-6 h-6 rounded-md transition-all border-2",
                                    style: {
                                        background: color.hex,
                                        borderColor: selectedColor === color.hex ? "#C6A962" : "transparent",
                                        opacity: 0.8
                                    },
                                    whileHover: {
                                        scale: 1.15
                                    },
                                    title: color.name
                                }, color.hex, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                    lineNumber: 489,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                            lineNumber: 481,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 pt-2 border-t border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: product.discount ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-light text-[10px] line-through",
                                            style: {
                                                fontFamily: "'Jost', sans-serif",
                                                color: "rgba(255,255,255,0.4)",
                                                letterSpacing: "0.07em"
                                            },
                                            children: [
                                                "EGP ",
                                                ((product.price ?? 0) * (1 + (product.discount ?? 0) / 100)).toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                            lineNumber: 516,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold leading-none mt-0.5",
                                            style: {
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: "0.95rem",
                                                color: "#C6A962",
                                                letterSpacing: "0.04em"
                                            },
                                            children: [
                                                "EGP ",
                                                (product.price ?? 0).toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                            lineNumber: 524,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-light leading-none text-[10px]",
                                            style: {
                                                fontFamily: "'Jost', sans-serif",
                                                color: "#C6A962",
                                                letterSpacing: "0.07em"
                                            },
                                            children: "EGP"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                            lineNumber: 536,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-light leading-none mt-0.5",
                                            style: {
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: "1.05rem",
                                                color: "#C6A962",
                                                letterSpacing: "0.04em"
                                            },
                                            children: (product.price ?? 0).toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-8 w-px",
                                style: {
                                    background: "rgba(255,255,255,0.08)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                onClick: handleAddToCart,
                                disabled: loading || outOfStock,
                                whileTap: {
                                    scale: 0.82
                                },
                                className: "flex items-center justify-center rounded-full transition-all duration-500 disabled:opacity-35",
                                style: {
                                    width: 36,
                                    height: 36,
                                    background: added ? "linear-gradient(135deg, rgba(198,169,98,0.28), rgba(198,169,98,0.10))" : "rgba(255,255,255,0.07)",
                                    border: added ? "1px solid rgba(198,169,98,0.45)" : "1px solid rgba(255,255,255,0.10)",
                                    backdropFilter: "blur(12px)",
                                    boxShadow: added ? "0 0 20px rgba(198,169,98,0.22)" : "none"
                                },
                                "aria-label": added ? "Added" : "Add to cart",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    animate: {
                                        rotate: loading ? 360 : 0
                                    },
                                    transition: {
                                        repeat: loading ? Infinity : 0,
                                        duration: 0.9,
                                        ease: "linear"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        strokeWidth: 1.25,
                                        className: "w-3.5 h-3.5 transition-colors duration-400",
                                        style: {
                                            color: added ? "#C6A962" : "rgba(255,255,255,0.45)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                        lineNumber: 583,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                    lineNumber: 579,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                                lineNumber: 561,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                lineNumber: 350,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute inset-x-0 bottom-0 h-px pointer-events-none z-50",
                initial: {
                    scaleX: 0,
                    opacity: 0
                },
                whileHover: {
                    scaleX: 1,
                    opacity: 1
                },
                transition: {
                    duration: 0.6,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1
                    ]
                },
                style: {
                    background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.6), transparent)",
                    transformOrigin: "center"
                }
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
                lineNumber: 594,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "wFGF1mxTkIFpl2ciV9kD7IdAU5w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CollectionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/components/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/lib/productsData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/value/use-scroll.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/AURE-LIEN-/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
/**
 * STEP 1: Organize products by category
 * 
 * This function takes your imported `products` array and organizes it
 * into categories based on the product's category field.
 */ const organizeProductsByCategory = (allProducts)=>{
    const organized = {
        "Jackets & Coats": [],
        "Suits": [],
        "Shirts": [],
        "Knitwear": [],
        "Denim": [],
        "Korean Pants": [],
        "Baggy Pants": [],
        "Sneakers": [],
        "Loafers": [],
        "Lace-Ups": [],
        "Sunglasses": [],
        "Bags & Wallets": [],
        "Belts": []
    };
    /**
   * STEP 2: Loop through each product from your import
   * and place it in the correct category
   */ allProducts.forEach((product)=>{
        const category = product.category || "";
        // Match product categories to our display categories
        if (category.toLowerCase().includes("jacket") || category.toLowerCase().includes("coat")) {
            organized["Jackets & Coats"].push(product);
        } else if (category.toLowerCase().includes("suit")) {
            organized["Suits"].push(product);
        } else if (category.toLowerCase().includes("shirt")) {
            organized["Shirts"].push(product);
        } else if (category.toLowerCase().includes("knit") || category.toLowerCase().includes("sweater")) {
            organized["Knitwear"].push(product);
        } else if (category.toLowerCase().includes("denim") || category.toLowerCase().includes("jean")) {
            organized["Denim"].push(product);
        } else if (category.toLowerCase().includes("korean")) {
            organized["Korean Pants"].push(product);
        } else if (category.toLowerCase().includes("baggy")) {
            organized["Baggy Pants"].push(product);
        } else if (category.toLowerCase().includes("sneaker")) {
            organized["Sneakers"].push(product);
        } else if (category.toLowerCase().includes("loafer")) {
            organized["Loafers"].push(product);
        } else if (category.toLowerCase().includes("lace") || category.toLowerCase().includes("oxford") || category.toLowerCase().includes("derby")) {
            organized["Lace-Ups"].push(product);
        } else if (category.toLowerCase().includes("sunglass")) {
            organized["Sunglasses"].push(product);
        } else if (category.toLowerCase().includes("bag") || category.toLowerCase().includes("wallet")) {
            organized["Bags & Wallets"].push(product);
        } else if (category.toLowerCase().includes("belt")) {
            organized["Belts"].push(product);
        }
    });
    return organized;
};
const SECTIONS = [
    {
        id: "menswear",
        label: "Menswear",
        items: [
            "Jackets & Coats",
            "Suits",
            "Shirts",
            "Knitwear",
            "Denim"
        ]
    },
    {
        id: "pants",
        label: "Pants",
        items: [
            "Denim",
            "Korean Pants",
            "Baggy Pants"
        ]
    },
    {
        id: "footwear",
        label: "Footwear",
        items: [
            "Sneakers",
            "Loafers",
            "Lace-Ups"
        ]
    },
    {
        id: "accessories",
        label: "Accessories",
        items: [
            "Sunglasses",
            "Bags & Wallets",
            "Belts"
        ]
    }
];
/**
 * STEP 3: SubcategorySection Component
 * 
 * This component receives a category name and the products in that category
 * It then displays each product using your ProductCard component
 */ function SubcategorySection({ title, productsInCategory }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once: true
        },
        transition: {
            duration: 0.5
        },
        className: "mb-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-2xl font-light text-slate-50",
                        style: {
                            fontFamily: "'Cormorant Garamond', serif",
                            letterSpacing: "0.08em"
                        },
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-px bg-gradient-to-r from-slate-700/50 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-slate-400 uppercase tracking-widest",
                        children: [
                            productsInCategory.length,
                            " items"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            productsInCategory.length > 0 ? // ✅ PRODUCTS FOUND: Show grid of ProductCards
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                children: productsInCategory.map((product, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20,
                            scale: 0.95
                        },
                        whileInView: {
                            opacity: 1,
                            y: 0,
                            scale: 1
                        },
                        viewport: {
                            once: true
                        },
                        transition: {
                            delay: idx * 0.05,
                            duration: 0.5
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            product: product
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                            lineNumber: 151,
                            columnNumber: 15
                        }, this)
                    }, product._id, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 143,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this) : // ❌ NO PRODUCTS: Show empty state
            // This happens when no products match this category from your imports
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                className: "py-12 text-center text-slate-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "No products in this category yet"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500 mt-2",
                        children: "Products will appear here once they are added to your collection."
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_c = SubcategorySection;
// ── FLOATING ORBS ──
function FloatingOrbs() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none absolute inset-0 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute rounded-full",
                style: {
                    width: 700,
                    height: 700,
                    top: "-20%",
                    right: "-15%",
                    background: "radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 70%)",
                    filter: "blur(80px)",
                    animation: "orbA 22s ease-in-out infinite"
                }
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute rounded-full",
                style: {
                    width: 500,
                    height: 500,
                    bottom: "5%",
                    left: "-10%",
                    background: "radial-gradient(circle, rgba(160,160,210,0.07) 0%, transparent 70%)",
                    filter: "blur(70px)",
                    animation: "orbB 28s ease-in-out infinite"
                }
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes orbA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.07)} }
        @keyframes orbB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-30px) scale(1.05)} }
      `
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_c1 = FloatingOrbs;
// ── GLASS NAV ──
function GlassNav({ active, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 p-1.5 rounded-full",
        style: {
            background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
        },
        children: SECTIONS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>{
                    onChange(s.id);
                    document.getElementById(s.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                },
                className: "relative px-5 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-light transition-all duration-400",
                style: {
                    color: active === s.id ? "#080808" : "rgba(255,255,255,0.5)",
                    background: active === s.id ? "linear-gradient(135deg, rgba(198,169,98,0.95) 0%, rgba(178,149,78,0.95) 100%)" : "transparent",
                    boxShadow: active === s.id ? "0 2px 12px rgba(198,169,98,0.4)" : "none",
                    fontFamily: "'Jost', sans-serif"
                },
                children: s.label
            }, s.id, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 222,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
        lineNumber: 212,
        columnNumber: 5
    }, this);
}
_c2 = GlassNav;
function CollectionPage() {
    _s();
    const heroRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("menswear");
    const { scrollYProgress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"])({
        target: heroRef,
        offset: [
            "start start",
            "end start"
        ]
    });
    const heroY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(scrollYProgress, [
        0,
        1
    ], [
        "0%",
        "25%"
    ]);
    const heroOpacity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(scrollYProgress, [
        0,
        0.8
    ], [
        1,
        0
    ]);
    /**
   * STEP 0: Memoize the organization of products
   * This only runs when the `products` import changes
   * Prevents unnecessary re-organization on every render
   */ const PRODUCTS_ORGANIZED = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CollectionPage.useMemo[PRODUCTS_ORGANIZED]": ()=>organizeProductsByCategory(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
    }["CollectionPage.useMemo[PRODUCTS_ORGANIZED]"], [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ]);
    // DEBUG: Log what products were found (can remove later)
    console.log("✅ Products imported:", __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$lib$2f$productsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].length, "items");
    console.log("📦 Products organized by category:", PRODUCTS_ORGANIZED);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        .glass-pill {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.14);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .glass-pill:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.09) 100%);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.28), 0 0 20px rgba(198,169,98,0.12);
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-line-1 { animation: heroIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .hero-line-2 { animation: heroIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .hero-line-3 { animation: heroIn 1s cubic-bezier(0.22,1,0.36,1) 0.8s both; }
        .hero-line-4 { animation: heroIn 1s cubic-bezier(0.22,1,0.36,1) 1.05s both; }
        .sticky-nav {
          background: linear-gradient(135deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.5) 100%);
          backdrop-filter: blur(28px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
      `
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].main, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    duration: 0.9
                },
                className: "relative bg-[#080808] text-white min-h-screen",
                style: {
                    fontFamily: "'Jost', sans-serif"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        ref: heroRef,
                        className: "relative h-[85vh] w-full overflow-hidden flex items-end justify-center pb-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                style: {
                                    y: heroY
                                },
                                className: "absolute inset-0 scale-110",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                    src: "/uploads/Goldmaa.mp4",
                                    autoPlay: true,
                                    loop: true,
                                    muted: true,
                                    playsInline: true,
                                    className: "absolute inset-0 w-full h-full object-cover",
                                    style: {
                                        filter: "brightness(0.5) saturate(0.85)"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 314,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0",
                                style: {
                                    background: "radial-gradient(ellipse at 50% 70%, transparent 20%, rgba(0,0,0,0.6) 100%)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-x-0 bottom-0 h-60",
                                style: {
                                    background: "linear-gradient(to top, #080808, transparent)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-x-0 top-0 h-24",
                                style: {
                                    background: "linear-gradient(to bottom, rgba(8,8,8,0.6), transparent)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                style: {
                                    opacity: heroOpacity
                                },
                                className: "relative z-10 text-center px-6 max-w-3xl mx-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "hero-line-1 text-white/30 text-[10px] tracking-[0.45em] uppercase font-light mb-5",
                                        children: "2025 Season"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "hero-line-2 font-light text-white mb-5 leading-none",
                                        style: {
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                                            letterSpacing: "0.04em",
                                            textShadow: "0 4px 40px rgba(0,0,0,0.5)"
                                        },
                                        children: [
                                            "The ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                style: {
                                                    color: "#C6A962",
                                                    fontStyle: "italic"
                                                },
                                                children: "Collection"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                lineNumber: 354,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "hero-line-3 text-white/45 font-light tracking-widest max-w-md mx-auto",
                                        style: {
                                            fontSize: "0.85rem",
                                            letterSpacing: "0.14em"
                                        },
                                        children: "Crafted in silence. Designed for presence."
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 356,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero-line-4 mt-8 flex items-center justify-center gap-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/shop",
                                            className: "glass-pill inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white text-[11px] font-light tracking-[0.25em] uppercase",
                                            children: [
                                                "Shop All",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    width: "14",
                                                    height: "14",
                                                    viewBox: "0 0 14 14",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M2 7h10M8 3l4 4-4 4",
                                                        stroke: "currentColor",
                                                        strokeWidth: "1",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-0 z-40 sticky-nav py-4 px-6 flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GlassNav, {
                            active: activeSection,
                            onChange: setActiveSection
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative px-6 max-w-7xl mx-auto py-20",
                        children: SECTIONS.map((section, sectionIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].section, {
                                id: section.id,
                                initial: {
                                    opacity: 0,
                                    y: 30
                                },
                                whileInView: {
                                    opacity: 1,
                                    y: 0
                                },
                                viewport: {
                                    once: true
                                },
                                transition: {
                                    duration: 0.6
                                },
                                className: "mb-24 scroll-mt-32",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 20
                                        },
                                        whileInView: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        viewport: {
                                            once: true
                                        },
                                        transition: {
                                            delay: 0.1,
                                            duration: 0.5
                                        },
                                        className: "mb-12 border-b border-slate-700/50 pb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/25 text-[10px] tracking-[0.4em] uppercase font-light mb-3",
                                                style: {
                                                    fontFamily: "'Jost', sans-serif"
                                                },
                                                children: "Collection"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-white font-light leading-none",
                                                style: {
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontSize: "clamp(2rem, 4vw, 3.2rem)",
                                                    letterSpacing: "0.06em",
                                                    color: "#C6A962"
                                                },
                                                children: section.label
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-20",
                                        children: section.items.map((categoryName)=>{
                                            const productsInCategory = PRODUCTS_ORGANIZED[categoryName] || [];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubcategorySection, {
                                                title: categoryName,
                                                productsInCategory: productsInCategory
                                            }, categoryName, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this),
                                    sectionIdx < SECTIONS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-24 h-px",
                                        style: {
                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, section.id, true, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "relative py-24 px-6 flex flex-col items-center justify-center text-center overflow-hidden mt-8",
                        style: {
                            background: "#060606"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 pointer-events-none",
                                style: {
                                    background: "radial-gradient(ellipse at 50% 100%, rgba(198,169,98,0.06) 0%, transparent 65%)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 458,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-x-0 top-0 h-px",
                                style: {
                                    background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.25), transparent)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 30
                                },
                                whileInView: {
                                    opacity: 1,
                                    y: 0
                                },
                                viewport: {
                                    once: true
                                },
                                transition: {
                                    duration: 0.9
                                },
                                className: "relative z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white/25 text-[10px] tracking-[0.45em] uppercase font-light mb-5",
                                        children: "Curated for You"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-light text-white mb-8 leading-tight",
                                        style: {
                                            fontFamily: "'Cormorant Garamond', serif",
                                            fontSize: "clamp(2rem, 5vw, 3.8rem)",
                                            letterSpacing: "0.05em"
                                        },
                                        children: [
                                            "Every Piece.",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                style: {
                                                    color: "#C6A962"
                                                },
                                                children: "One Vision."
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                                lineNumber: 491,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 481,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/shop",
                                        className: "glass-pill inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-[11px] font-light tracking-[0.3em] uppercase",
                                        children: "Shop the Full Edit"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                        lineNumber: 493,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                                lineNumber: 471,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                        lineNumber: 454,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/AURE-LIEN-/app/collection/page.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(CollectionPage, "ieGawp93pr+gYGoeFXWvfZYet2w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$AURE$2d$LIEN$2d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c3 = CollectionPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SubcategorySection");
__turbopack_context__.k.register(_c1, "FloatingOrbs");
__turbopack_context__.k.register(_c2, "GlassNav");
__turbopack_context__.k.register(_c3, "CollectionPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_GitHub_AURE-LIEN-_6285f365._.js.map
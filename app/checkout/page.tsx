"use client";

import productsData from "@/lib/productsData";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, MapPin, Package, Truck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Product { _id: string; name: string; price: number; images: string[]; }
interface FullCartItem {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string | null;
  color?: string | null;
}
interface FormData {
  email: string; newsletter: boolean; country: string;
  firstName: string; lastName: string; address: string;
  apartment: string; city: string; postalCode: string;
  phone: string; shippingMethod: string;
}

const SHIPPING_COST_CAIRO = 75;

/* ── Shared glass input style ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "rgba(255,255,255,0.80)",
  fontSize: "0.85rem",
  letterSpacing: "0.04em",
  outline: "none",
  fontFamily: "'Jost', sans-serif",
  transition: "border-color 0.3s, box-shadow 0.3s",
};
const inputFocusClass = "focus:border-[rgba(198,169,98,0.45)] focus:shadow-[0_0_0_3px_rgba(198,169,98,0.08)]";

/* ── Section card ── */
function GlassSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.14)",
      }}
    >
      {/* Specular line */}
      <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
           style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl"
             style={{
               background: "linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))",
               border: "1px solid rgba(198,169,98,0.2)",
             }}>
          <span style={{ color: "#C6A962" }}>{icon}</span>
        </div>
        <h2
          className="font-light text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", letterSpacing: "0.08em" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{ position:"absolute", width:700, height:700, top:"-10%", right:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter:"blur(90px)", animation:"ckOA 26s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:550, height:550, bottom:"5%", left:"-8%",
        background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"ckOB 32s ease-in-out infinite" }} />
      <style>{`
        @keyframes ckOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
        @keyframes ckOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(35px,-20px)} }
      `}</style>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<FullCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fromCart, setFromCart] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: "", newsletter: false, country: "Egypt",
    firstName: "", lastName: "", address: "", apartment: "",
    city: "", postalCode: "", phone: "", shippingMethod: "within_egypt",
  });
  const saveDraftRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveDraft = useCallback(async (items: FullCartItem[], formData: FormData) => {
    if (items.length === 0) return;
    try {
      await fetch("/api/checkout-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ _id: i._id, productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })), form: formData }),
      });
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Try to get userId from localStorage
        const userId = typeof window !== "undefined" ? localStorage.getItem('userId') : null;
        
        // Try draft first
        const draftRes = await fetch("/api/checkout-draft");
        const draftData = await draftRes.json();
        const draft = draftData.draft;
        if (draft?.items?.length > 0) {
          setCart(draft.items.map((i: any) => ({
            _id: i._id||i.productId,
            productId: i.productId||i._id,
            name: i.name??"Unknown",
            price: Number(i.price??0),
            quantity: i.quantity??1,
            image: i.image||"/images/placeholder.svg",
            size: i.size ?? null,
            color: i.color ?? null,
          })));
          setFromCart(true);
          if (draft.form) setForm((prev) => ({ ...prev, ...draft.form }));
          setLoading(false); 
          return;
        }

        // Try sessionStorage checkoutItems
        const checkoutJson = typeof window !== "undefined" ? sessionStorage.getItem("checkoutItems") : null;
        if (checkoutJson) {
          const items = JSON.parse(checkoutJson);
          const merged = items.map((i: any) => ({
            _id: i._id||i.productId,
            productId: i.productId||i._id,
            name: i.name??"Unknown",
            price: Number(i.price??0),
            quantity: i.quantity??1,
            image: i.image||"/images/placeholder.svg",
            size: i.size ?? null,
            color: i.color ?? null,
          }));
          if (merged.length > 0) { setCart(merged); setLoading(false); return; }
        }

        // Try sessionStorage selectedOrder
        const selectedJson = typeof window !== "undefined" ? sessionStorage.getItem("selectedOrder") : null;
        if (selectedJson) {
          const sel = JSON.parse(selectedJson);
          const items = (sel.items||[])
            .filter((i: any) => (i.productId||i._id) && (i.quantity??1)>0)
            .map((i: any) => ({
              _id: i.productId||i._id,
              productId: i.productId||i._id,
              name: i.name??"Unknown",
              price: Number(i.price??0),
              quantity: i.quantity??1,
              image: i.image||"/images/placeholder.svg",
              size: i.size ?? null,
              color: i.color ?? null,
            }));
          if (items.length > 0) { 
            setCart(items); 
            if (sel.customer) setForm((f) => ({ 
              ...f, 
              email: sel.customer.email||"", 
              firstName: sel.customer.firstName||"", 
              lastName: sel.customer.lastName||"", 
              address: sel.customer.address||"", 
              city: sel.customer.city||"", 
              phone: sel.customer.phone||"" 
            })); 
            setLoading(false); 
            return; 
          }
        }

        // ✅ Finally try /api/cart with userId
        setFromCart(true);
        if (!userId) {
          setError("Please log in to continue.");
          setCart([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/cart?userId=${userId}`);
        const cartData = await res.json();
        const items = cartData.items||[];
        
        if (!Array.isArray(items)||items.length===0) { 
          setError("Your cart is empty."); 
          setCart([]); 
          setLoading(false); 
          return; 
        }

        // ✅ MAP ITEMS TO FULL PRODUCT DETAILS (IMPORTANT!)
        setCart(items.map((i: any) => {
          const p = productsData.find((p: Product) => String(p._id) === String(i.productId));
          return {
            _id: i.productId,
            productId: i.productId,
            name: i.name??p?.name??"Unknown",
            price: Number(i.price??p?.price??0),
            quantity: i.quantity??1,
            image: i.image??p?.images?.[0]??"/images/placeholder.svg",
            size: i.size ?? null,
            color: i.color ?? null,
          };
        }));
      } catch (err) { 
        console.error("Failed to load checkout:", err);
        setError("Failed to load checkout data."); 
      }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (cart.length === 0) return;
    if (saveDraftRef.current) clearTimeout(saveDraftRef.current);
    saveDraftRef.current = setTimeout(() => { saveDraft(cart, form); saveDraftRef.current = null; }, 800);
    return () => { if (saveDraftRef.current) clearTimeout(saveDraftRef.current); };
  }, [cart, form, saveDraft]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = form.shippingMethod === "within_egypt" ? SHIPPING_COST_CAIRO : 0;
  const total = subtotal + shippingCost;

  const update = (k: keyof FormData, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function handleCancel() {
    setError("");
    setSuccess("");
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("checkoutItems");
        sessionStorage.removeItem("selectedOrder");
      }
      await fetch("/api/checkout-draft", { method: "DELETE" });
    } catch {
      // swallow cancel errors
    } finally {
      router.push("/cart");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 
    setSubmitting(true);

    // ✅ Validate cart
    if (!cart.length) { 
      setError("No products to order."); 
      setSubmitting(false); 
      return; 
    }

    // ✅ Validate form fields
    const required: [keyof FormData, string][] = [
      ["email","email"],
      ["firstName","first name"],
      ["lastName","last name"],
      ["address","address"],
      ["city","city"],
      ["phone","phone"]
    ];
    for (const [k, label] of required) { 
      if (!form[k]) { 
        setError(`Please enter your ${label}.`); 
        setSubmitting(false); 
        return; 
      } 
    }

    // ✅ BUILD ITEMS ARRAY WITH FULL DETAILS (NOT JUST _id!)
    const items = cart
      .filter(item => item.productId && (item.quantity ?? 0) > 0)
      .map((item) => ({
        productId: item.productId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "One Size",
        color: item.color || "Default",
        image: item.image || "/images/placeholder.svg",
      }));

    if (!items.length) { 
      setError("No valid items in cart."); 
      setSubmitting(false); 
      return; 
    }

    console.log("📤 Sending order payload:", {
      items,
      total,
      customerInfo: {
        email: form.email,
        name: `${form.firstName} ${form.lastName}`,
        address: form.address,
        city: form.city,
        phone: form.phone,
      }
    });

    try {
      const res = await fetch("/api/saveorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items, // ✅ Full item objects with name, price, quantity, etc.
          total,
          customerInfo: {
            email: form.email,
            name: `${form.firstName} ${form.lastName}`,
            address: form.address,
            apartment: form.apartment || undefined,
            city: form.city,
            postalCode: form.postalCode || undefined,
            country: form.country,
            phone: form.phone,
            newsletter: form.newsletter,
          },
        }),
      });

      const data = await res.json();
      console.log("📥 Server response:", data);

      if (!res.ok) { 
        throw new Error(data?.error || "Failed to place order"); 
      }

      setSuccess("Order placed successfully."); 
      setCart([]);
      
      // ✅ Clear cart data
      if (typeof window !== "undefined") { 
        sessionStorage.removeItem("checkoutItems"); 
        sessionStorage.removeItem("selectedOrder"); 
      }
      await fetch("/api/checkout-draft", { method: "DELETE" });
      
      if (fromCart) await fetch("/api/cart", { method: "DELETE" });

      // Redirect to orders page
      setTimeout(() => router.push("/orders"), 1800);
    } catch (err: any) { 
      console.error("❌ Order error:", err);
      setError(err.message || "Failed to place order."); 
    }
    finally { 
      setSubmitting(false); 
    }
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <motion.p animate={{ opacity:[0.3,0.7,0.3] }} transition={{ repeat:Infinity, duration:1.8 }}
        className="text-white/30 text-[10px] tracking-[0.4em] uppercase"
        style={{ fontFamily:"'Jost', sans-serif" }}>
        Loading Checkout…
      </motion.p>
    </div>
  );

  /* ── Success overlay ── */
  if (success) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity:0, scale:0.95, y:20 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
        className="text-center max-w-sm"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
               style={{ background:"linear-gradient(135deg, rgba(198,169,98,0.2), rgba(198,169,98,0.06))", border:"1px solid rgba(198,169,98,0.3)" }}>
            <CheckCircle2 strokeWidth={1.2} className="w-8 h-8" style={{ color:"#C6A962" }} />
          </div>
        </div>
        <h2 className="font-light text-white mb-3" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"2rem", letterSpacing:"0.06em" }}>
          Order <em style={{ color:"#C6A962" }}>Confirmed</em>
        </h2>
        <p className="text-white/35 text-sm font-light tracking-widest">Redirecting to your orders…</p>
      </motion.div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #C6A962; color: #080808; }

        input[type="text"], input[type="email"], input[type="tel"], select, textarea {
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.09) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          color: rgba(255,255,255,0.80) !important;
          font-size: 0.85rem !important;
          letter-spacing: 0.04em !important;
          font-family: 'Jost', sans-serif !important;
          outline: none !important;
          transition: border-color 0.3s, box-shadow 0.3s !important;
          width: 100%;
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.22) !important; }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(198,169,98,0.45) !important;
          box-shadow: 0 0 0 3px rgba(198,169,98,0.08) !important;
        }
        select option { background: #141414; color: rgba(255,255,255,0.8); }

        input[type="checkbox"] {
          accent-color: #C6A962;
          width: 14px !important; height: 14px !important;
          border-radius: 4px !important;
          padding: 0 !important;
        }
        input[type="radio"] {
          accent-color: #C6A962;
          width: 14px !important; height: 14px !important;
          padding: 0 !important;
        }
      `}</style>

      <div className="relative min-h-screen bg-[#080808] text-white" style={{ fontFamily:"'Jost', sans-serif" }}>
        <Orbs />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pt-28 pb-32">

          {/* ── HEADER ── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="mb-12">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Final Step</p>
            <h1 className="font-light text-white leading-none mb-2"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.5rem, 6vw, 4.5rem)", letterSpacing:"0.04em" }}>
              Check<em style={{ color:"#C6A962", fontStyle:"italic" }}>out</em>
            </h1>
            <div className="mt-5 h-px" style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.4), transparent)" }} />
          </motion.div>

          {/* ── ERROR ── */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="mb-6 px-5 py-3.5 rounded-2xl flex items-center gap-3"
                style={{ background:"rgba(255,60,60,0.08)", border:"1px solid rgba(255,80,80,0.2)", backdropFilter:"blur(16px)" }}>
                <span className="text-red-400/70 text-xs tracking-[0.2em] font-light">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

              {/* ── LEFT — form ── */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Contact */}
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.7 }}>
                  <GlassSection icon={<User strokeWidth={1.3} className="w-4 h-4" />} title="Contact">
                    <div className="flex flex-col gap-3 max-w-lg">
                      <p className="text-white/25 text-[10px] tracking-[0.25em] font-light">
                        Have an account?{" "}
                        <Link href="/login" className="text-[#C6A962] hover:underline transition-all">Sign in</Link>
                      </p>
                      <input type="email" placeholder="Email address" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" required />
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={form.newsletter} onChange={(e) => update("newsletter", e.target.checked)} />
                        <span className="text-white/30 text-[10px] tracking-[0.22em] uppercase group-hover:text-white/50 transition-colors">
                          Email me with news and offers
                        </span>
                      </label>
                    </div>
                  </GlassSection>
                </motion.div>

                {/* Delivery */}
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18, duration:0.7 }}>
                  <GlassSection icon={<MapPin strokeWidth={1.3} className="w-4 h-4" />} title="Delivery">
                    <div className="grid gap-3 max-w-lg">
                      <select value={form.country} onChange={(e) => update("country", e.target.value)} required>
                        <option value="Egypt">Egypt</option>
                      </select>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="First name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} autoComplete="given-name" required />
                        <input type="text" placeholder="Last name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} autoComplete="family-name" required />
                      </div>
                      <input type="text" placeholder="Address" value={form.address} onChange={(e) => update("address", e.target.value)} autoComplete="street-address" required />
                      <input type="text" placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={(e) => update("apartment", e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} autoComplete="address-level2" required />
                        <input type="text" placeholder="Postal code (optional)" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
                      </div>
                      <input type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" required />
                    </div>
                  </GlassSection>
                </motion.div>

                {/* Shipping */}
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.26, duration:0.7 }}>
                  <GlassSection icon={<Truck strokeWidth={1.3} className="w-4 h-4" />} title="Shipping Method">
                    <div className="max-w-lg">
                      <label
                        className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300"
                        style={form.shippingMethod === "within_egypt" ? {
                          background:"linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.04))",
                          border:"1px solid rgba(198,169,98,0.3)",
                        } : {
                          background:"rgba(255,255,255,0.03)",
                          border:"1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" name="shipping" value="within_egypt"
                            checked={form.shippingMethod === "within_egypt"}
                            onChange={() => update("shippingMethod", "within_egypt")} />
                          <div>
                            <p className="text-white/70 text-sm font-light tracking-wide">Within egypt</p>
                            <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mt-0.5">Standard Delivery · 2–3 days</p>
                          </div>
                        </div>
                        <span className="font-light" style={{ color:"#C6A962", fontFamily:"'Cormorant Garamond', serif", fontSize:"1.1rem" }}>
                          EGP 75
                        </span>
                      </label>
                    </div>
                  </GlassSection>
                </motion.div>

                {/* Submit / Cancel */}
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.34, duration:0.7 }}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale:1.015 }}
                      whileTap={{ scale:0.985 }}
                      className="relative w-full overflow-hidden rounded-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
                      style={{
                        background:"linear-gradient(135deg, rgba(198,169,98,0.22), rgba(178,149,78,0.10))",
                        border:"1px solid rgba(198,169,98,0.35)",
                        backdropFilter:"blur(16px)",
                        boxShadow:"0 0 28px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                      }}
                    >
                      <span className="text-[#C6A962] text-[10px] tracking-[0.32em] uppercase font-light">
                        {submitting ? "Placing Order…" : "Place Order"}
                      </span>
                      {!submitting && <ChevronRight strokeWidth={1.3} className="w-4 h-4 text-[#C6A962]" />}
                    </motion.button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full rounded-full py-4 text-[10px] tracking-[0.28em] uppercase font-light border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                    >
                      Cancel Checkout
                    </button>
                  </div>
                </motion.div>
              </form>

              {/* ── RIGHT — Order summary ── */}
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}
                className="sticky top-24 flex flex-col gap-4">

                {/* Summary card */}
                <div className="relative overflow-hidden rounded-2xl p-5"
                     style={{ background:"linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%)", backdropFilter:"blur(24px) saturate(160%)", WebkitBackdropFilter:"blur(24px) saturate(160%)", border:"1px solid rgba(255,255,255,0.09)", boxShadow:"0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.14)" }}>
                  <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                       style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }} />

                  <p className="text-white/20 text-[9px] tracking-[0.4em] uppercase mb-4">Your Order</p>
                  <h3 className="font-light text-white mb-5" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.4rem", letterSpacing:"0.07em" }}>
                    Order <em style={{ color:"#C6A962" }}>Summary</em>
                  </h3>

                  {/* Items */}
                  <div className="flex flex-col gap-3 mb-5">
                    {cart.map((item, i) => (
                      <div key={`${item._id}-${item.size || "nosize"}-${item.color || "nocolor"}-${i}`} className="flex items-center gap-3">
                        <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-xl"
                             style={{ boxShadow:"0 4px 16px rgba(0,0,0,0.4)" }}>
                          <Image src={item.image||"/images/placeholder.svg"} alt={item.name} fill className="object-cover" sizes="56px" />
                          {/* Qty badge */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-light"
                               style={{ background:"rgba(198,169,98,0.9)", color:"#080808" }}>
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/60 text-xs font-light truncate"
                             style={{ fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.05em" }}>
                            {item.name}
                          </p>
                          {(item.size || item.color) && (
                            <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mt-0.5">
                              {item.size && <>Size {item.size}</>}
                              {item.color && <> · Color {item.color}</>}
                            </p>
                          )}
                        </div>
                        <p className="text-white/45 text-xs font-light shrink-0">
                          EGP {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-4" style={{ background:"rgba(255,255,255,0.06)" }} />

                  {/* Pricing rows */}
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between">
                      <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Subtotal</p>
                      <p className="text-white/50 text-xs">EGP {subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">Shipping</p>
                      <p className="text-white/50 text-xs">EGP {shippingCost.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Total row */}
                  <div className="rounded-xl px-4 py-3.5 flex justify-between items-center"
                       style={{ background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))", border:"1px solid rgba(198,169,98,0.22)" }}>
                    <p className="text-[#C6A962] text-[9px] tracking-[0.35em] uppercase">Total</p>
                    <p className="font-light" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.3rem", color:"#C6A962", letterSpacing:"0.06em" }}>
                      EGP {total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-col gap-2">
                  {[
                    { icon:<Package strokeWidth={1.2} className="w-3.5 h-3.5" />, text:"Secure checkout" },
                    { icon:<Truck strokeWidth={1.2} className="w-3.5 h-3.5" />, text:"Free returns on all orders" },
                    { icon:<CheckCircle2 strokeWidth={1.2} className="w-3.5 h-3.5" />, text:"Authentic pieces, guaranteed" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-white/20">{b.icon}</span>
                      <p className="text-white/20 text-[9px] tracking-[0.25em] uppercase">{b.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* ── Empty ── */
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
              className="flex flex-col items-center justify-center text-center py-28">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6"
                   style={{ background:"linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))", border:"1px solid rgba(255,255,255,0.09)" }}>
                <Package strokeWidth={1} className="w-7 h-7 text-white/20" />
              </div>
              <h2 className="font-light text-white mb-3"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.8rem", letterSpacing:"0.06em" }}>
                Nothing to <em style={{ color:"#C6A962" }}>checkout</em>
              </h2>
              <p className="text-white/25 text-sm font-light tracking-widest mb-8">Add items to your cart first.</p>
              <Link href="/shop"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[#C6A962] text-[10px] tracking-[0.3em] uppercase font-light transition-all duration-500 hover:scale-[1.02]"
                style={{ background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))", border:"1px solid rgba(198,169,98,0.25)", backdropFilter:"blur(16px)" }}>
                Continue Shopping
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
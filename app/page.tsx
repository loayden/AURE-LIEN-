"use client";

import ProductCard from "@/components/ProductCard";
import products from "@/lib/productsData";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const COLLECTION_HIGHLIGHTS = [
  { title: "Jackets & Coats", image: "/uploads/Jackets & Coats.jpg", link: "/jackets-coats" },
  { title: "Pants",           image: "/uploads/denim.jpg",            link: "/pants" },
  { title: "Sneakers",        image: "/uploads/Sneakers.jpg",         link: "/sneakers" },
  { title: "Accessories",     image: "/uploads/accessories.jpg",      link: "/accessories" },
];

const LOOKBOOK_CHAPTERS = [
  { image: "/uploads/Look1.jpg", chapter: "I",   subtitle: "Autumn" },
  { image: "/uploads/Look2.jpg", chapter: "II",  subtitle: "Structure" },
  { image: "/uploads/Look3.jpg", chapter: "III", subtitle: "Evening" },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const stmtRef = useRef<HTMLElement>(null);
  const featuredProducts = products.slice(0, 4);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);
  const heroY       = useTransform(heroScroll, [0, 1],    ["0%","18%"]);

  const { scrollYProgress: stmtScroll } = useScroll({ target: stmtRef, offset: ["start end","end start"] });
  const stmtY = useTransform(stmtScroll, [0, 1], ["0%","14%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background:#080808; font-family:'Jost',sans-serif; }
        ::selection { background:#C6A962; color:#080808; }
      `}</style>

      <main className="relative bg-[#080808] overflow-x-hidden">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">

          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <video
              src="/uploads/0316 (3).mp4"
              autoPlay loop muted playsInline
              className="w-full h-full object-cover"
              style={{ filter:"brightness(0.42) saturate(0.85)" }}
            />
          </motion.div>

          <div className="absolute inset-0"
               style={{ background:"radial-gradient(ellipse at 50% 65%, transparent 25%, rgba(0,0,0,0.6) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-56"
               style={{ background:"linear-gradient(to top, #080808, transparent)" }} />
          <div className="absolute inset-x-0 top-0 h-28"
               style={{ background:"linear-gradient(to bottom, rgba(8,8,8,0.55), transparent)" }} />

          <motion.div style={{ opacity: heroOpacity }}
                      className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.span
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.3 }}
              className="inline-block mb-8 px-5 py-2 rounded-full text-white/35 text-[9px] tracking-[0.45em] uppercase font-light"
              style={{
                background:"linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
                backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.09)",
                boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              New Collection — 2025
            </motion.span>

            <motion.h1
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:1.1, delay:0.45, ease:[0.22,1,0.36,1] }}
              className="font-light text-white leading-none mb-6"
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(3.5rem, 9vw, 8rem)",
                letterSpacing:"0.04em",
                textShadow:"0 4px 48px rgba(0,0,0,0.35)",
              }}
            >
              Enduring<br />
              <em style={{ color:"#C6A962", fontStyle:"italic" }}>by Design.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.7 }}
              className="text-white/35 font-light mb-10 max-w-xs leading-relaxed"
              style={{ fontSize:"0.85rem", letterSpacing:"0.12em" }}
            >
              Refined menswear for those who speak through presence.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.9 }}
              className="flex items-center gap-4"
            >
              <Link href="/collection"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white text-[10px] font-light tracking-[0.28em] uppercase transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
                  backdropFilter:"blur(20px) saturate(180%)", border:"1px solid rgba(255,255,255,0.18)",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22)",
                }}>
                Explore Collection
                <ArrowRight strokeWidth={1.2} className="w-3.5 h-3.5" />
              </Link>
              <Link href="shop"
                className="px-6 py-3.5 rounded-full text-white/40 text-[10px] font-light tracking-[0.28em] uppercase border border-white/10 hover:border-white/22 hover:text-white/65 transition-all duration-400">
                SHOP
              </Link>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 z-10">
            <span className="text-white text-[8px] tracking-[0.4em] uppercase">Scroll</span>
            <div className="w-px h-9 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ══════════════════════════════════════
            PHILOSOPHY
        ══════════════════════════════════════ */}
        <section ref={stmtRef} className="relative py-36 overflow-hidden"
                 style={{ background:"linear-gradient(180deg, #080808 0%, #0d0d0d 100%)" }}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div style={{ position:"absolute", width:600, height:600, top:"-10%", left:"-8%",
              background:"radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 65%)",
              filter:"blur(80px)", animation:"stOA 22s ease-in-out infinite" }} />
            <div style={{ position:"absolute", width:480, height:480, bottom:"-5%", right:"-5%",
              background:"radial-gradient(circle, rgba(160,150,220,0.06) 0%, transparent 65%)",
              filter:"blur(70px)", animation:"stOB 28s ease-in-out infinite" }} />
            <style>{`
              @keyframes stOA{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-25px)}}
              @keyframes stOB{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,20px)}}
            `}</style>
          </div>

          <motion.div style={{ y: stmtY }} className="relative z-10 text-center px-6">
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ duration:0.8 }}
              className="text-white/18 text-[9px] tracking-[0.5em] uppercase mb-8">
              Philosophy
            </motion.p>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:1, ease:[0.22,1,0.36,1] }}
              className="font-light text-white leading-tight"
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.2rem, 5.5vw, 5rem)", letterSpacing:"0.05em" }}
            >
              Presence Requires<br />
              <em style={{ color:"#C6A962" }}>No Introduction.</em>
            </motion.h2>
          </motion.div>

          <div className="relative z-10 mt-20 flex items-center justify-center gap-3 sm:gap-6 flex-wrap px-6">
            {[{ value:"2025", label:"Established" },{ value:"20+", label:"shop" },{ value:"100%", label:"Sustainable" }].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.1, duration:0.75 }}
                className="px-7 py-4 rounded-2xl text-center"
                style={{
                  background:"linear-gradient(135deg, rgba(198,169,98,0.10), rgba(198,169,98,0.03))",
                  backdropFilter:"blur(18px)", border:"1px solid rgba(198,169,98,0.16)",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.10)",
                }}>
                <p className="font-light leading-none mb-1"
                   style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.8rem", color:"#C6A962" }}>
                  {s.value}
                </p>
                <p className="text-white/25 text-[8px] tracking-[0.35em] uppercase">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            COLLECTION GRID
        ══════════════════════════════════════ */}
        <section className="py-28 px-6 sm:px-12 bg-[#080808]">
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8 }} className="text-center mb-14">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Categories</p>
            <h2 className="font-light text-white"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.8rem, 4vw, 3.2rem)", letterSpacing:"0.06em" }}>
              Explore the <em style={{ color:"#C6A962" }}>Collection</em>
            </h2>
            <div className="mt-5 mx-auto w-10 h-px"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)" }} />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {COLLECTION_HIGHLIGHTS.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.09, duration:0.85, ease:[0.22,1,0.36,1] }}>
                <Link href={item.link} className="group block relative overflow-hidden"
                  style={{ borderRadius:24, boxShadow:"0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)" }}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={item.image} alt={item.title} fill
                      className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                      sizes="(max-width:768px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/10 group-hover:from-black/55 transition-all duration-700" />
                  </div>
                  <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
                       style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }} />
                  <div className="absolute bottom-3 left-3 right-3 px-4 py-3 rounded-xl"
                       style={{
                         background:"linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 100%)",
                         backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.10)",
                       }}>
                    <p className="text-white/80 text-sm font-light tracking-[0.12em]"
                       style={{ fontFamily:"'Cormorant Garamond', serif" }}>
                      {item.title}
                    </p>
                    <div className="mt-2 h-px w-0 group-hover:w-full transition-all duration-500"
                         style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.7), transparent)" }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            LOOKBOOK
        ══════════════════════════════════════ */}
        <section className="py-28 px-6 sm:px-12"
                 style={{ background:"linear-gradient(180deg, #0a0a0a 0%, #080808 100%)" }}>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8 }} className="text-center mb-14">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Lookbook</p>
            <h2 className="font-light text-white"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.8rem, 4vw, 3.2rem)", letterSpacing:"0.06em" }}>
              The 2025 <em style={{ color:"#C6A962" }}>Edit</em>
            </h2>
            <div className="mt-5 mx-auto w-10 h-px"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)" }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {LOOKBOOK_CHAPTERS.map((ch, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i * 0.12, duration:0.9, ease:[0.22,1,0.36,1] }}
                className="group relative cursor-pointer overflow-hidden"
                style={{ borderRadius:28, boxShadow:"0 28px 72px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)" }}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image src={ch.image} alt={ch.subtitle} fill
                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 90vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                </div>
                <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
                     style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }} />
                <div className="absolute bottom-4 left-4 right-4 px-5 py-4 rounded-2xl"
                     style={{
                       background:"linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                       backdropFilter:"blur(18px) saturate(150%)", border:"1px solid rgba(255,255,255,0.12)",
                     }}>
                  <p className="text-white/35 text-[8px] tracking-[0.35em] uppercase mb-0.5">Chapter {ch.chapter}</p>
                  <p className="text-white/80 font-light"
                     style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.1rem", letterSpacing:"0.12em" }}>
                    {ch.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/lookbook"
              className="inline-flex items-center gap-2.5 text-white/30 text-[9px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors duration-300">
              View Full Lookbook <ArrowRight strokeWidth={1.2} className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════
            BRAND STORY
        ══════════════════════════════════════ */}
        <section className="py-28 px-6 sm:px-12 bg-[#080808]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center">
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}>
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-6">Our Story</p>
              <h2 className="font-light text-white leading-tight mb-5"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2rem, 4vw, 3.2rem)", letterSpacing:"0.04em" }}>
                Founded in<br /><em style={{ color:"#C6A962" }}>Restraint.</em>
              </h2>
              <div className="mb-7 w-8 h-px"
                   style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.6), transparent)" }} />
              <p className="text-white/35 font-light leading-relaxed mb-10 max-w-sm"
                 style={{ fontSize:"0.9rem", letterSpacing:"0.06em" }}>
                Designed for those who understand that elegance requires no announcement. Presence, when true, speaks for itself.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-2.5 text-white/35 text-[9px] tracking-[0.3em] uppercase hover:text-white/65 transition-colors duration-300">
                Our Heritage <ArrowRight strokeWidth={1.2} className="w-3 h-3" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.9, delay:0.1, ease:[0.22,1,0.36,1] }}
              className="relative">
              <div className="relative aspect-[4/5] overflow-hidden"
                   style={{ borderRadius:28, boxShadow:"0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)" }}>
                <Image src="/uploads/accessories.jpg" alt="Craftsmanship" fill
                  className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                <div className="absolute inset-0"
                     style={{ background:"linear-gradient(to top, rgba(8,8,8,0.35), transparent)" }} />
              </div>
              <div className="absolute -bottom-5 -left-5 px-5 py-4 rounded-2xl"
                   style={{
                     background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.04))",
                     backdropFilter:"blur(20px)", border:"1px solid rgba(198,169,98,0.22)",
                     boxShadow:"0 8px 28px rgba(198,169,98,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
                   }}>
                <p className="text-[#C6A962] text-[9px] tracking-[0.3em] uppercase font-light">Handcrafted</p>
                <p className="text-white/40 text-[9px] tracking-widest mt-0.5">Since 2019</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FEATURED PRODUCTS
        ══════════════════════════════════════ */}
        <section className="py-28 px-6 sm:px-12"
                 style={{ background:"linear-gradient(180deg, #0a0a0a 0%, #080808 100%)" }}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.8 }} className="text-center mb-14">
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">Selection</p>
              <h2 className="font-light text-white"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.8rem, 4vw, 3.2rem)", letterSpacing:"0.06em" }}>
                Featured <em style={{ color:"#C6A962" }}>Pieces</em>
              </h2>
              <div className="mt-5 mx-auto w-10 h-px"
                   style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.55), transparent)" }} />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product, i) => (
                <motion.div key={product._id}
                  initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay: i * 0.08, duration:0.8 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link href="/shop"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white/70 text-[10px] font-light tracking-[0.28em] uppercase transition-all duration-400 hover:scale-[1.02] hover:text-white/90"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                  backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.09)",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                View All Pieces <ArrowRight strokeWidth={1.2} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FOOTER CTA
        ══════════════════════════════════════ */}
        <section className="relative py-28 px-6 flex flex-col items-center justify-center text-center overflow-hidden"
                 style={{ background:"#060606" }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:"radial-gradient(ellipse at 50% 100%, rgba(198,169,98,0.06) 0%, transparent 60%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
               style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.22), transparent)" }} />
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
            className="relative z-10">
            <p className="text-white/18 text-[9px] tracking-[0.5em] uppercase mb-5">Ready?</p>
            <h2 className="font-light text-white mb-10"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2rem, 5vw, 4rem)", letterSpacing:"0.05em" }}>
              Begin Your <em style={{ color:"#C6A962" }}>Collection.</em>
            </h2>
            <Link href="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-[#C6A962] text-[10px] font-light tracking-[0.3em] uppercase transition-all duration-500 hover:scale-[1.02]"
              style={{
                background:"linear-gradient(135deg, rgba(198,169,98,0.18), rgba(198,169,98,0.06))",
                backdropFilter:"blur(16px)", border:"1px solid rgba(198,169,98,0.28)",
                boxShadow:"0 0 32px rgba(198,169,98,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}>
              Shop Now <ArrowRight strokeWidth={1.2} className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </section>

      </main>
    </>
  );
}
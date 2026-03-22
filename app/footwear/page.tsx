"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const ITEMS = [
  { title: "Sneakers", subtitle: "Sculpted for the streets", image: "/uploads/Sneakers.jpg", link: "/sneakers" },
  { title: "Loafers", subtitle: "Italian-last construction", image: "/uploads/Loafers.jpg", link: "/loafers" },
  { title: "Lace-Ups", subtitle: "Oxford precision", image: "/uploads/Lace-Ups.jpg", link: "/lace-ups" },
];

const MATERIALS = [
  { label: "Full-grain Calf Leather", detail: "Tanned in Santa Croce, Italy" },
  { label: "Goodyear Welt", detail: "Recraftable, lasts decades" },
  { label: "Sculpted Last", detail: "3D-modelled for natural gait" },
];

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position: "absolute", width: 750, height: 750, top: "-15%", left: "-10%",
        background: "radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter: "blur(90px)", animation: "oA 26s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 550, height: 550, bottom: "10%", right: "-8%",
        background: "radial-gradient(circle, rgba(140,140,210,0.05) 0%, transparent 65%)",
        filter: "blur(80px)", animation: "oB 32s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes oA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(35px,-30px)} }
        @keyframes oB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,25px)} }
      `}</style>
    </div>
  );
}

export default function FootwearPage() {
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);

  const { scrollYProgress: gridScroll } = useScroll({ target: gridRef, offset: ["start end", "end start"] });
  const titleY = useTransform(gridScroll, [0, 1], ["0%", "16%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .fu2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .fu3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.65s both; }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .gold-glass {
          background: linear-gradient(135deg, rgba(198,169,98,0.14) 0%, rgba(198,169,98,0.04) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(198,169,98,0.22);
          box-shadow: 0 8px 32px rgba(198,169,98,0.08), inset 0 1px 0 rgba(255,255,255,0.14);
        }

        .card-hover:hover .card-img { transform: scale(1.05); }
        .card-hover:hover .card-dim  { opacity: 0.4; }
        .card-hover:hover .card-bar  { width: 72px; }
        .card-hover:hover .card-cta  { opacity: 1; transform: translateX(0); }
      `}</style>

      <motion.main
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#080808] text-white min-h-screen"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <Orbs />

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center">
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <video
              src="/uploads/footwear.mp4"
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.42) saturate(0.8)" }}
            />
          </motion.div>

          <div className="absolute inset-0"
               style={{ background: "radial-gradient(ellipse at 50% 65%, transparent 20%, rgba(0,0,0,0.65) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-56"
               style={{ background: "linear-gradient(to top, #080808, transparent)" }} />
          <div className="absolute inset-x-0 top-0 h-28"
               style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.55), transparent)" }} />

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 px-6 flex flex-col items-center">
            <div className="fu1 mb-7">
              <span className="glass inline-block px-5 py-2 rounded-full text-[9px] text-white/50 tracking-[0.4em] uppercase font-light">
                2025 Footwear
              </span>
            </div>
            <h1
              className="fu2 font-light text-white leading-none mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(4rem, 11vw, 9.5rem)",
                letterSpacing: "0.04em",
                textShadow: "0 4px 50px rgba(0,0,0,0.5)",
              }}
            >
              Foot<em style={{ color: "#C6A962", fontStyle: "italic" }}>wear</em>
            </h1>
            <p className="fu3 text-white/40 font-light max-w-xs leading-relaxed"
               style={{ fontSize: "0.82rem", letterSpacing: "0.16em" }}>
              Precision beneath every step.<br />Crafted for those who walk with authority.
            </p>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 z-10">
            <span className="text-white text-[9px] tracking-[0.35em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="relative z-10 py-20 px-6 max-w-2xl mx-auto text-center">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-6">Design</p>
            <h2
              className="font-light text-white leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                letterSpacing: "0.06em",
              }}
            >
              The Architecture<br />
              <em style={{ color: "#C6A962" }}>of Movement</em>
            </h2>
            <div className="mx-auto mb-7 w-10 h-px"
                 style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.7), transparent)" }} />
            <p className="text-white/35 font-light leading-relaxed" style={{ fontSize: "0.88rem", letterSpacing: "0.06em" }}>
              Every silhouette is constructed with discipline.<br />
              From sculpted sneakers to formal lace-ups,<br />
              balance defines the design.
            </p>
          </motion.div>

          {/* Stat pills */}
          <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            {[
              { v: "3", l: "Silhouettes" },
              { v: "Italian", l: "Leather" },
              { v: "Handmade", l: "Construction" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="gold-glass px-5 py-3 rounded-2xl text-center"
              >
                <p className="font-light mb-0.5"
                   style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#C6A962", letterSpacing: "0.07em" }}>
                  {s.v}
                </p>
                <p className="text-white/30 text-[9px] tracking-[0.28em] uppercase">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COLLECTION GRID ── */}
        <section ref={gridRef} className="relative z-10 py-10 pb-28 px-6 sm:px-12 max-w-6xl mx-auto">
          <motion.div style={{ y: titleY }} className="text-center mb-14">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5">Collection</p>
            <h2
              className="font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                letterSpacing: "0.06em",
                color: "#C6A962",
              }}
            >
              The Footwear Edit
            </h2>
          </motion.div>

          {/* Sneakers full-width on top, Loafers + Lace-Ups side by side */}
          <div className="flex flex-col gap-5">
            {/* Row 1 — Sneakers full width */}
            {[ITEMS[0]].map((item, i) => (
              <motion.div
                key={item.link}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={item.link} className="card-hover group block relative overflow-hidden"
                      style={{ borderRadius: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)" }}>
                  <div className="absolute inset-x-6 top-0 h-px z-20 pointer-events-none"
                       style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }} />
                  <div className="relative overflow-hidden" style={{ aspectRatio: "21/9" }}>
                    <Image src={item.image} alt={item.title} fill
                           className="card-img object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                           sizes="100vw" />
                    <div className="card-dim absolute inset-0 bg-black/60 transition-opacity duration-700" />
                    <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
                         style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 px-5 py-4 rounded-2xl"
                       style={{
                         background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%)",
                         backdropFilter: "blur(20px) saturate(150%)",
                         border: "1px solid rgba(255,255,255,0.13)",
                       }}>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-white font-light leading-none mb-1"
                           style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", letterSpacing: "0.07em" }}>
                          {item.title}
                        </p>
                        <p className="text-white/35 text-[9px] tracking-[0.28em] uppercase">{item.subtitle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="card-bar h-px w-10 transition-all duration-500"
                             style={{ background: "rgba(198,169,98,0.7)" }} />
                        <p className="card-cta text-[#C6A962] text-[10px] tracking-[0.25em] uppercase opacity-0 translate-x-2 transition-all duration-500">
                          Shop →
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Row 2 — Loafers + Lace-Ups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ITEMS.slice(1).map((item, i) => (
                <motion.div
                  key={item.link}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i + 1) * 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={item.link} className="card-hover group block relative overflow-hidden"
                        style={{ borderRadius: 24, boxShadow: "0 20px 56px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)" }}>
                    <div className="absolute inset-x-4 top-0 h-px z-20 pointer-events-none"
                         style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
                    <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                      <Image src={item.image} alt={item.title} fill
                             className="card-img object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                             sizes="(max-width: 640px) 100vw, 50vw" />
                      <div className="card-dim absolute inset-0 bg-black/60 transition-opacity duration-700" />
                      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
                           style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 px-4 py-3.5 rounded-xl"
                         style={{
                           background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                           backdropFilter: "blur(18px) saturate(150%)",
                           border: "1px solid rgba(255,255,255,0.12)",
                         }}>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-white font-light leading-none mb-1"
                             style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", letterSpacing: "0.07em" }}>
                            {item.title}
                          </p>
                          <p className="text-white/30 text-[9px] tracking-[0.26em] uppercase">{item.subtitle}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="card-bar h-px w-8 transition-all duration-500"
                               style={{ background: "rgba(198,169,98,0.65)" }} />
                          <p className="card-cta text-[#C6A962] text-[9px] tracking-[0.22em] uppercase opacity-0 translate-x-2 transition-all duration-500">
                            Shop →
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CRAFT STORY ── */}
        <section className="relative z-10 py-24 px-6 sm:px-12 overflow-hidden"
                 style={{ background: "#060606" }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(198,169,98,0.05) 0%, transparent 60%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
               style={{ background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.2), transparent)" }} />

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5">Craftsmanship</p>
              <h2
                className="font-light text-white leading-tight mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  letterSpacing: "0.05em",
                }}
              >
                Crafted<br />
                <em style={{ color: "#C6A962" }}>with Intent.</em>
              </h2>
              <div className="w-8 h-px mb-6"
                   style={{ background: "linear-gradient(90deg, rgba(198,169,98,0.6), transparent)" }} />
              <p className="text-white/35 font-light leading-relaxed" style={{ fontSize: "0.88rem", letterSpacing: "0.05em" }}>
                Italian leather. Sculpted soles. Controlled stitching.<br />
                Every detail engineered for precision and longevity.
              </p>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="flex flex-col gap-3"
            >
              {MATERIALS.map((m, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="glass px-5 py-4 rounded-2xl flex items-center gap-4"
                >
                  <div className="w-1.5 h-8 rounded-full shrink-0"
                       style={{ background: "linear-gradient(to bottom, rgba(198,169,98,0.85), rgba(198,169,98,0.15))" }} />
                  <div>
                    <p className="text-white/75 text-sm font-light"
                       style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.08em" }}>
                      {m.label}
                    </p>
                    <p className="text-white/25 text-[9px] tracking-[0.22em] uppercase mt-0.5">{m.detail}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </motion.main>
    </>
  );
}

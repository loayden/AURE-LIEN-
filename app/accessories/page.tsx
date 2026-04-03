"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { withPublicAssetVersion } from "@/lib/publicAsset";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const ITEMS = [
  { title: "Sunglasses", subtitle: "Precision-cut lenses", image: withPublicAssetVersion("/uploads/sunglasses.jpg"), link: "/sunglasses" },
  { title: "Bags & Wallets", subtitle: "Hand-stitched leather", image: withPublicAssetVersion("/uploads/Bags & Wallets.jpg"), link: "/bags-wallets" },
  { title: "Belts", subtitle: "Sculpted metal accents", image: withPublicAssetVersion("/uploads/Belts.jpg"), link: "/belts" },
];

const DETAILS = [
  { value: "Handcrafted", label: "Artisan Made" },
  { value: "Italian", label: "Sourced Leather" },
  { value: "Limited", label: "Runs Each Season" },
];

/* ── Floating ambient orbs ── */
export default function AccessoriesPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.9], [1, 0]);

  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <>
      <style>{`
        body { background: #0A0908; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .au-1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .au-2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .au-3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.65s both; }

        .glass {
          background: linear-gradient(135deg, rgba(255,248,236,0.09) 0%, rgba(255,248,236,0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,248,236,0.10);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,248,236,0.16);
        }

        .gold-glass {
          background: linear-gradient(135deg, rgba(201,168,106,0.14) 0%, rgba(201,168,106,0.04) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(201,168,106,0.22);
          box-shadow: 0 8px 32px rgba(201,168,106,0.08), inset 0 1px 0 rgba(255,248,236,0.14);
        }

        .card-hover:hover .card-img { transform: scale(1.05); }
        .card-hover:hover .card-overlay { opacity: 0.45; }
        .card-hover:hover .card-bar { width: 80px; }
        .card-hover:hover .card-arrow { opacity: 1; transform: translateX(0); }
      `}</style>

      <motion.main
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#0A0908] text-white min-h-screen"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative mobile-safe-hero w-full overflow-hidden flex items-center justify-center text-center">
          {/* Parallax image */}
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <Image
              src={withPublicAssetVersion("/uploads/accessories.jpg")}
              alt="Accessories"
              fill
              className="object-cover"
              style={{ filter: "brightness(0.45) saturate(0.8)" }}
              priority
              sizes="100vw"
            />
          </motion.div>

          {/* Overlays */}
          <div className="absolute inset-0"
               style={{ background: "radial-gradient(ellipse at 50% 60%, transparent 25%, rgba(0,0,0,0.65) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-56"
               style={{ background: "linear-gradient(to top, #0A0908, transparent)" }} />
          <div className="absolute inset-x-0 top-0 h-28"
               style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.55), transparent)" }} />

          {/* Content */}
          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-10">
            {/* Eyebrow */}
            <div className="au-1 mb-7">
              <span className="glass inline-block px-5 py-2 rounded-full text-[9px] text-white/50 tracking-[0.4em] uppercase font-light">
                The Atelier Selection
              </span>
            </div>

            {/* Title */}
            <h1
              className="au-2 font-light text-white leading-none mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 7vw, 4.5rem)",
                letterSpacing: "0.05em",
                textShadow: "0 4px 48px rgba(0,0,0,0.5)",
              }}
            >
              Acces<em style={{ color: "#C9A86A", fontStyle: "italic" }}>sories</em>
            </h1>

            {/* Sub */}
            <p className="au-3 text-white/40 font-light max-w-xs mx-auto leading-relaxed"
               style={{ fontSize: "0.82rem", letterSpacing: "0.16em" }}>
              Precision in detail.<br />Identity in the smallest elements.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-30 sm:flex">
            <span className="text-white text-[9px] tracking-[0.35em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ── PHILOSOPHY STRIP ── */}
        <section className="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center sm:px-6 sm:py-20 md:px-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-6">Philosophy</p>
            <h2
              className="font-light text-white leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                letterSpacing: "0.06em",
              }}
            >
              Defined by Detail
            </h2>
            <div className="mx-auto mb-7 w-10 h-px"
                 style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,106,0.7), transparent)" }} />
            <p className="text-white/35 font-light leading-relaxed" style={{ fontSize: "0.88rem", letterSpacing: "0.06em" }}>
              Accessories are not additions —<br />
              they are extensions of character.<br />
              Designed to refine presence without excess.
            </p>
          </motion.div>

          {/* Stats row */}
          <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            {DETAILS.map((d, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="gold-glass px-5 py-3 rounded-2xl text-center"
              >
                <p className="font-light mb-0.5"
                   style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#C9A86A", letterSpacing: "0.06em" }}>
                  {d.value}
                </p>
                <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase">{d.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COLLECTION GRID ── */}
        <section ref={parallaxRef} className="relative z-10 max-w-6xl mx-auto px-4 py-10 pb-16 sm:px-6 sm:pb-24 md:px-10">
          <motion.div style={{ y: titleY }} className="text-center mb-14">
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5">Collection</p>
            <h2
              className="font-light text-white"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                letterSpacing: "0.06em",
                color: "#C9A86A",
              }}
            >
              The Atelier Selection
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                /* Make Bags span full width on sm+ since it's the middle item */
                className={i === 1 ? "sm:col-span-2" : ""}
              >
                <Link href={item.link} className="card-hover group block relative overflow-hidden"
                      style={{
                        borderRadius: 28,
                        boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,248,236,0.07)",
                      }}>
                  {/* Specular top line */}
                  <div className="absolute inset-x-6 top-0 h-px z-20 pointer-events-none"
                       style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.22), transparent)" }} />

                  {/* Image */}
                  <div className={`relative overflow-hidden ${i === 1 ? "aspect-[16/7]" : "aspect-[4/5]"}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="card-img object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      sizes={i === 1 ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
                    />
                    <div className="card-overlay absolute inset-0 bg-black/60 transition-opacity duration-700" />
                    <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
                         style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
                  </div>

                  {/* Glass label */}
                  <div
                    className="absolute bottom-5 left-5 right-5 px-5 py-4 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,248,236,0.13) 0%, rgba(255,248,236,0.04) 100%)",
                      backdropFilter: "blur(20px) saturate(150%)",
                      border: "1px solid rgba(255,248,236,0.13)",
                    }}
                  >
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p
                          className="text-white font-light leading-none mb-1"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: i === 1 ? "1.6rem" : "1.3rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {item.title}
                        </p>
                        <p className="text-white/35 text-[9px] tracking-[0.28em] uppercase">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {/* Expanding underline bar */}
                        <div className="card-bar h-px transition-all duration-500 w-10"
                             style={{ background: "rgba(201,168,106,0.7)" }} />
                        {/* Arrow */}
                        <p className="card-arrow text-[#C9A86A] text-[10px] tracking-[0.25em] uppercase opacity-0 translate-x-2 transition-all duration-500">
                          Shop →
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CRAFT STORY ── */}
        <section className="relative z-10 overflow-hidden px-4 py-16 sm:px-6 sm:py-24 md:px-10"
                 style={{ background: "#14110F" }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,106,0.05) 0%, transparent 60%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
               style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,106,0.2), transparent)" }} />

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
                The Art of<br />
                <em style={{ color: "#C9A86A" }}>Finishing.</em>
              </h2>
              <div className="w-8 h-px mb-6"
                   style={{ background: "linear-gradient(90deg, rgba(201,168,106,0.6), transparent)" }} />
              <p className="text-white/35 font-light leading-relaxed" style={{ fontSize: "0.88rem", letterSpacing: "0.05em" }}>
                Hand-stitched leather. Precision-cut lenses.<br />
                Sculpted metal accents.<br />
                Every accessory refined to complete the silhouette.
              </p>
            </motion.div>

            {/* Glass material callouts */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="flex flex-col gap-3"
            >
              {[
                { label: "Full-grain Leather", detail: "Sourced from tanneries in Florence" },
                { label: "CR-39 Optical Lenses", detail: "UV400 protection, hand-polished" },
                { label: "Solid Brass Hardware", detail: "Aged patina finish, hand-buffed" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="glass px-5 py-4 rounded-2xl flex items-center gap-4"
                >
                  <div className="w-1.5 h-8 rounded-full shrink-0"
                       style={{ background: "linear-gradient(to bottom, rgba(201,168,106,0.8), rgba(201,168,106,0.2))" }} />
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

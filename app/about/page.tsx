"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position:"absolute", width:700, height:700, top:"-15%", right:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter:"blur(90px)", animation:"abOA 26s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", width:550, height:550, bottom:"5%", left:"-8%",
        background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"abOB 33s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", width:400, height:400, top:"40%", left:"45%",
        background:"radial-gradient(circle, rgba(198,169,98,0.04) 0%, transparent 65%)",
        filter:"blur(70px)", animation:"abOA 20s ease-in-out infinite reverse",
      }} />
      <style>{`
        @keyframes abOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
        @keyframes abOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }
      `}</style>
    </div>
  );
}

/* ── Stat card ── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl relative overflow-hidden"
      style={{
        background:"linear-gradient(135deg, rgba(198,169,98,0.12) 0%, rgba(198,169,98,0.03) 100%)",
        backdropFilter:"blur(20px) saturate(150%)",
        border:"1px solid rgba(198,169,98,0.20)",
        boxShadow:"0 8px 32px rgba(198,169,98,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      <div className="absolute inset-x-4 top-0 h-px"
           style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />
      <p className="font-light text-white leading-none"
         style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"2.6rem", color:"#C6A962", letterSpacing:"0.04em" }}>
        {value}
      </p>
      <p className="text-white/35 text-[9px] tracking-[0.35em] uppercase"
         style={{ fontFamily:"'Jost', sans-serif" }}>
        {label}
      </p>
    </div>
  );
}

/* ── Pillar card ── */
function Pillar({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity:0, y:30 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-60px" }}
      transition={{ duration:0.85, ease:[0.22,1,0.36,1] }}
      className="relative overflow-hidden rounded-2xl p-8 flex flex-col gap-4"
      style={{
        background:"linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter:"blur(24px) saturate(160%)",
        border:"1px solid rgba(255,255,255,0.09)",
        boxShadow:"0 16px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.13)",
      }}
    >
      <div className="absolute inset-x-5 top-0 h-px pointer-events-none"
           style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }} />
      <p className="font-light" style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"3rem", color:"rgba(198,169,98,0.25)", lineHeight:1 }}>
        {number}
      </p>
      <h3 className="font-light text-white"
          style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.5rem", letterSpacing:"0.06em" }}>
        {title}
      </h3>
      <div className="w-8 h-px" style={{ background:"rgba(198,169,98,0.5)" }} />
      <p className="text-white/35 font-light leading-relaxed text-sm"
         style={{ fontFamily:"'Jost', sans-serif", letterSpacing:"0.05em" }}>
        {body}
      </p>
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:["start start","end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0,0.8], [1,0]);
  const heroY = useTransform(scrollYProgress, [0,1], ["0%","18%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #C6A962; color: #080808; }
      `}</style>

      <main className="relative bg-[#080808] text-white min-h-screen overflow-x-hidden"
            style={{ fontFamily:"'Jost', sans-serif" }}>
        <Orbs />

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section ref={heroRef} className="relative mobile-safe-hero flex items-center justify-center overflow-hidden">
          {/* BG gradient only — no image needed for About */}
          <div className="absolute inset-0"
               style={{ background:"radial-gradient(ellipse at 50% 60%, rgba(198,169,98,0.07) 0%, transparent 60%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-64"
               style={{ background:"linear-gradient(to top, #080808, transparent)" }} />

          <motion.div style={{ opacity:heroOpacity, y:heroY }}
                      className="relative z-10 text-center px-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8 }}
              className="mb-8"
            >
              <span
                className="inline-block px-5 py-2 rounded-full text-white/35 text-[9px] tracking-[0.45em] uppercase font-light"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
                  backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,255,255,0.10)",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.14)",
                }}
              >
                Est. 2025 — Cairo
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:1, delay:0.1, ease:[0.22,1,0.36,1] }}
              className="font-light text-white leading-none mb-6"
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(5rem, 14vw, 12rem)",
                letterSpacing:"0.06em",
                textShadow:"0 4px 60px rgba(0,0,0,0.4)",
              }}
            >
              AURÉ<em style={{ color:"#C6A962", fontStyle:"italic" }}>LIEN</em>
            </motion.h1>

            <motion.div
              initial={{ scaleX:0 }}
              animate={{ scaleX:1 }}
              transition={{ duration:1, delay:0.4, ease:[0.22,1,0.36,1] }}
              className="mb-8 h-px w-24 origin-left"
              style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.7), transparent)" }}
            />

            <motion.p
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.5 }}
              className="text-white/35 font-light max-w-md leading-relaxed"
              style={{ fontSize:"0.9rem", letterSpacing:"0.12em" }}
            >
              We do not follow trends.
              <br />
              We construct permanence.
            </motion.p>
          </motion.div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-25 sm:flex">
            <span className="text-white text-[9px] tracking-[0.4em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ══════════════════════════════════════
            MANIFESTO
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity:0 }}
              whileInView={{ opacity:1 }}
              viewport={{ once:true }}
              transition={{ duration:0.8 }}
              className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-6"
            >
              Our Manifesto
            </motion.p>

            <motion.h2
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
              className="font-light text-white mb-10 leading-tight"
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2rem,5vw,4rem)", letterSpacing:"0.05em" }}
            >
              Born at the intersection of<br />
              <em style={{ color:"#C6A962" }}>craftsmanship</em> and identity.
            </motion.h2>

            <motion.p
              initial={{ opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.9, delay:0.1 }}
              className="text-white/35 font-light leading-relaxed max-w-xl mx-auto"
              style={{ fontSize:"0.92rem", letterSpacing:"0.07em" }}
            >
              AURÉLIEN was conceived as a refusal — a refusal to be ordinary, to be seasonal, to be forgotten. Every piece we create carries the weight of intention. We source with discipline, construct with obsession, and release with restraint. The result is not fashion. It is architecture for the body.
            </motion.p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-16 px-6"
                 style={{ borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Stat value="2025"  label="Founded" />
            <Stat value="100+"  label="Pieces Crafted" />
            <Stat value="12"    label="Materials Sourced" />
            <Stat value="1"     label="Standard: Perfection" />
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            THREE PILLARS
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.8 }}
              className="text-center mb-16"
            >
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5">What We Stand For</p>
              <h2
                className="font-light text-white"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2rem,5vw,3.5rem)", letterSpacing:"0.05em" }}
              >
                Precision. Power. <em style={{ color:"#C6A962" }}>Permanence.</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Pillar
                number="01"
                title="Precision"
                body="Every seam is deliberate. Every proportion is considered. We do not approximate — we measure, refine, and iterate until the garment is exactly what it must be. Precision is not a feature. It is the foundation."
              />
              <Pillar
                number="02"
                title="Power"
                body="Clothing is not passive. The right piece commands a room before you speak a word. We design for presence — for the man who understands that what he wears is an extension of what he believes about himself."
              />
              <Pillar
                number="03"
                title="Permanence"
                body="We build pieces that last beyond seasons, beyond trends, beyond the moment of purchase. AURÉLIEN is not a wardrobe refresh. It is an investment in a version of yourself that does not expire."
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STORY — TWO COL
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-24 px-6"
                 style={{ background:"#060606", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity:0, x:-30 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
              className="relative overflow-hidden"
              style={{
                borderRadius:28,
                aspectRatio:"4/5",
                boxShadow:"0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              <div className="absolute inset-x-5 top-0 h-px z-10 pointer-events-none"
                   style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)" }} />
              <Image
                src="/uploads/Suits.jpg"
                alt="The Atelier"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              <div className="absolute inset-0"
                   style={{ background:"linear-gradient(to top, rgba(6,6,6,0.5) 0%, transparent 50%)" }} />

              {/* Floating badge */}
              <div
                className="absolute bottom-5 left-5 px-4 py-3 rounded-xl"
                style={{
                  background:"linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                  backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,255,255,0.12)",
                }}
              >
                <p className="text-white/30 text-[8px] tracking-[0.35em] uppercase mb-0.5"
                   style={{ fontFamily:"'Jost', sans-serif" }}>The Atelier</p>
                <p className="text-white/70 font-light"
                   style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"0.9rem", letterSpacing:"0.08em" }}>
                  Cairo, Egypt
                </p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity:0, x:30 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.9, delay:0.12, ease:[0.22,1,0.36,1] }}
              className="flex flex-col gap-6"
            >
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Our Story</p>
              <h2
                className="font-light text-white leading-tight"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.8rem,4vw,3rem)", letterSpacing:"0.05em" }}
              >
                Built in Cairo.<br />
                Worn <em style={{ color:"#C6A962" }}>everywhere.</em>
              </h2>
              <div className="w-10 h-px" style={{ background:"linear-gradient(90deg, rgba(198,169,98,0.6), transparent)" }} />
              <p className="text-white/35 font-light leading-relaxed text-sm"
                 style={{ letterSpacing:"0.05em" }}>
                AURÉLIEN was founded in Cairo by designers who grew up between two worlds — the ancient craft traditions of the Middle East and the sharp minimalism of European tailoring. The result is a language all its own: structured but fluid, rich but restrained.
              </p>
              <p className="text-white/30 font-light leading-relaxed text-sm"
                 style={{ letterSpacing:"0.05em" }}>
                We source our fabrics from mills in Italy, Japan, and Turkey. We cut every pattern by hand. We refuse to compromise on construction because we believe the inside of a garment matters as much as the outside. A piece that feels extraordinary is a piece that gets worn for decades.
              </p>
              <p className="text-white/25 font-light leading-relaxed text-sm"
                 style={{ letterSpacing:"0.05em" }}>
                This is not a brand that wants to be everywhere. We want to be in the right wardrobe — the one that belongs to someone who thinks before they buy, and buys to keep.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            MATERIAL PHILOSOPHY
        ══════════════════════════════════════ */}
        <section className="relative z-10 py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.8 }}
              className="text-center mb-14"
            >
              <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5">Material Philosophy</p>
              <h2
                className="font-light text-white"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.8rem,4.5vw,3.2rem)", letterSpacing:"0.05em" }}
              >
                Nothing synthetic. Nothing <em style={{ color:"#C6A962" }}>accidental.</em>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { origin:"Italy", material:"Full-Grain Calf Leather", note:"Sourced from the tanneries of Santa Croce sull'Arno. Vegetable-tanned. Ages beautifully." },
                { origin:"Japan", material:"Selvedge Denim", note:"Woven on shuttle looms in Kojima. Every yard carries a slight irregularity that makes each piece one of a kind." },
                { origin:"Turkey", material:"Mercerised Cotton", note:"Long-staple Aegean cotton, combed and mercerised for a silk-like handle and lasting colour depth." },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, y:24 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ duration:0.8, delay: i * 0.1, ease:[0.22,1,0.36,1] }}
                  className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3"
                  style={{
                    background:"linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                    backdropFilter:"blur(20px) saturate(150%)",
                    border:"1px solid rgba(255,255,255,0.08)",
                    boxShadow:"0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                >
                  <div className="absolute left-0 top-4 bottom-4 w-px"
                       style={{ background:"linear-gradient(to bottom, transparent, rgba(198,169,98,0.45), transparent)" }} />
                  <p className="text-white/20 text-[8px] tracking-[0.4em] uppercase pl-4"
                     style={{ fontFamily:"'Jost', sans-serif" }}>
                    {m.origin}
                  </p>
                  <h3 className="text-white font-light pl-4"
                      style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.1rem", letterSpacing:"0.07em" }}>
                    {m.material}
                  </h3>
                  <p className="text-white/30 text-xs font-light leading-relaxed pl-4"
                     style={{ letterSpacing:"0.05em" }}>
                    {m.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CLOSING CTA
        ══════════════════════════════════════ */}
        <section
          className="relative z-10 py-32 px-6 text-center overflow-hidden"
          style={{ background:"#060606", borderTop:"1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:"radial-gradient(ellipse at 50% 100%, rgba(198,169,98,0.06) 0%, transparent 60%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
               style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.2), transparent)" }} />

          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
            className="relative z-10 max-w-2xl mx-auto"
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-6">The Collection</p>
            <h2
              className="font-light text-white mb-4 leading-tight"
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2rem,5vw,4rem)", letterSpacing:"0.05em" }}
            >
              Wear what <em style={{ color:"#C6A962" }}>lasts.</em>
            </h2>
            <p className="text-white/30 font-light leading-relaxed mb-10 max-w-sm mx-auto text-sm"
               style={{ letterSpacing:"0.07em" }}>
              Explore the full AURÉLIEN collection — each piece a statement, each purchase a commitment to a higher standard.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full font-light transition-all duration-500 hover:scale-[1.02]"
              style={{
                background:"linear-gradient(135deg, rgba(198,169,98,0.20), rgba(198,169,98,0.07))",
                backdropFilter:"blur(16px)",
                border:"1px solid rgba(198,169,98,0.30)",
                boxShadow:"0 0 32px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                color:"#C6A962",
                fontSize:"10px",
                letterSpacing:"0.32em",
                fontFamily:"'Jost', sans-serif",
              }}
            >
              Explore the Shop
              <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </section>

      </main>
    </>
  );
}

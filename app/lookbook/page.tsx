"use client";

import { withPublicAssetVersion } from "@/lib/publicAsset";
import productsData from "@/lib/productsData";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const STATIC_SECTIONS = [
  { title: "Autumn Tailoring",  image: withPublicAssetVersion("/uploads/Jackets & Coats.jpg"), slug: "autumn-tailoring",  chapter: "I",   hotspots: [] as { productId: string; x: number; y: number }[] },
  { title: "Summer Riviera",    image: withPublicAssetVersion("/uploads/Suits.jpg"),            slug: "summer-riviera",    chapter: "II",  hotspots: [] },
  { title: "Modern Essentials", image: withPublicAssetVersion("/uploads/Sneakers.jpg"),         slug: "modern-essentials", chapter: "III", hotspots: [] },
];

interface Section {
  title: string;
  image: string;
  slug: string;
  chapter?: string;
  hotspots: { productId: string; x: number; y: number }[];
}

/* ── Single lookbook section ── */
function LookbookSection({ section, index }: { section: Section; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset:["start end","end start"] });
  const imgY = useTransform(scrollYProgress, [0,1], ["0%","10%"]);

  const isReversed = index % 2 === 1;

  return (
    <motion.section
      ref={ref}
      initial={false}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-80px" }}
      transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${isReversed ? "md:grid-flow-dense" : ""}`}
    >
      {/* Image column */}
      <div className={isReversed ? "md:col-start-2" : ""}>
        <div
          className="relative overflow-hidden group"
          style={{
            borderRadius:28,
            aspectRatio:"3/4",
            boxShadow:"0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,248,236,0.07)",
          }}
        >
          {/* Specular top line */}
          <div className="absolute inset-x-6 top-0 h-px z-20 pointer-events-none"
               style={{ background:"linear-gradient(90deg, transparent, rgba(255,248,236,0.2), transparent)" }} />

          {/* Parallax image */}
          <motion.div style={{ y:imgY }} className="absolute inset-0 scale-110">
            <Image
              src={section.image || withPublicAssetVersion("/uploads/main.jpg")}
              alt={section.title}
              fill
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10
                          group-hover:from-black/40 transition-all duration-700" />

          {/* Hotspots */}
          {section.hotspots?.map((h) => {
            const product = productsData.find((p) => p._id === h.productId);
            if (!product) return null;
            return (
              <Link
                key={h.productId}
                href={`/product/${h.productId}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group/dot"
                style={{ left:`${h.x}%`, top:`${h.y}%` }}
                title={product.name}
              >
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ background:"rgba(168,121,53,0.5)" }} />
                <span
                  className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 group/dot-hover:scale-110"
                  style={{
                    background:"linear-gradient(135deg, rgba(168,121,53,0.25), rgba(168,121,53,0.10))",
                    backdropFilter:"blur(12px)",
                    border:"1px solid rgba(168,121,53,0.5)",
                  }}
                >
                  <Plus strokeWidth={1.5} className="w-3.5 h-3.5" style={{ color:"#A87935" }} />
                </span>
                {/* Tooltip */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 rounded-xl opacity-0 group-hover/dot:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap"
                  style={{
                    background:"linear-gradient(135deg, rgba(20,20,22,0.95), rgba(12,12,14,0.98))",
                    backdropFilter:"blur(20px)",
                    border:"1px solid rgba(255,248,236,0.09)",
                    fontSize:"9px",
                    letterSpacing:"0.22em",
                    color:"rgba(255,248,236,0.65)",
                    fontFamily:"'Jost', sans-serif",
                  }}
                >
                  {product.name}
                </div>
              </Link>
            );
          })}

          {/* Chapter label bottom-left */}
          <div
            className="absolute bottom-4 left-4 px-4 py-2.5 rounded-xl z-10"
            style={{
              background:"linear-gradient(135deg, rgba(255,248,236,0.12) 0%, rgba(255,248,236,0.04) 100%)",
              backdropFilter:"blur(16px) saturate(150%)",
              border:"1px solid rgba(255,248,236,0.12)",
            }}
          >
            <p className="text-white/35 text-[8px] tracking-[0.35em] uppercase mb-0.5"
               style={{ fontFamily:"'Jost', sans-serif" }}>
              Chapter {section.chapter ?? String(index + 1)}
            </p>
            <p className="text-white/70 font-light"
               style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"0.9rem", letterSpacing:"0.1em" }}>
              {section.title}
            </p>
          </div>
        </div>
      </div>

      {/* Text column */}
      <div className={isReversed ? "md:col-start-1 md:row-start-1" : ""}>
        <motion.div
          initial={false}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9, delay:0.15, ease:[0.22,1,0.36,1] }}
        >
          {/* Eyebrow */}
          <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5"
             style={{ fontFamily:"'Jost', sans-serif" }}>
            Chapter {section.chapter ?? String(index + 1)}
          </p>

          {/* Title */}
          <h2
            className="font-light text-white leading-tight mb-5"
            style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:"clamp(2rem, 4.5vw, 3.5rem)",
              letterSpacing:"0.05em",
            }}
          >
            {section.title.split(" ").map((word, wi) =>
              wi === section.title.split(" ").length - 1
                ? <em key={wi} style={{ color:"#A87935", fontStyle:"italic" }}>{word}</em>
                : <span key={wi}>{word} </span>
            )}
          </h2>

          {/* Gold divider */}
          <div className="mb-6 w-10 h-px"
               style={{ background:"linear-gradient(90deg, rgba(168,121,53,0.6), transparent)" }} />

          {/* Description */}
          <p className="text-white/35 font-light leading-relaxed mb-8 max-w-sm"
             style={{ fontSize:"0.88rem", letterSpacing:"0.05em", fontFamily:"'Jost', sans-serif" }}>
            Editorial curation for the modern wardrobe. Discover the collection behind the campaign — each piece chosen for presence and restraint.
          </p>

          {/* CTA */}
          <Link
            href="/shop"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-5 py-3.5 font-light transition-all duration-500 hover:scale-[1.02] sm:gap-3 sm:px-7"
            style={{
              background:"linear-gradient(135deg, rgba(168,121,53,0.18) 0%, rgba(168,121,53,0.06) 100%)",
              backdropFilter:"blur(16px)",
              border:"1px solid rgba(168,121,53,0.28)",
              boxShadow:"0 8px 28px rgba(168,121,53,0.08)",
              color:"#A87935",
              fontSize:"10px",
              letterSpacing:"0.3em",
              fontFamily:"'Jost', sans-serif",
            }}
          >
            Shop the Look
            <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function LookbookPage() {
  const [sections, setSections] = useState<Section[]>(STATIC_SECTIONS);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target:heroRef, offset:["start start","end start"] });
  const heroOpacity = useTransform(heroScroll, [0,0.8], [1,0]);
  const heroY = useTransform(heroScroll, [0,1], ["0%","20%"]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/lookbooks?published=true", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Unable to load lookbook");
        return r.json();
      })
      .then((lookbooks: { sections: Section[] }[]) => {
        if (lookbooks?.length > 0 && lookbooks[0].sections?.length > 0)
          setSections(lookbooks[0].sections);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load lookbook");
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <style>{`
        body { background: #F5F1E8; }
      `}</style>

      <main className="relative min-h-screen bg-[#F5F1E8] text-white" style={{ fontFamily:"'Jost', sans-serif" }}>
        {error ? (
          <div className="relative z-20 mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:px-10">
            <div
              className="rounded-2xl px-4 py-3"
              style={{ background: "rgba(154,34,34,0.08)", border: "1px solid rgba(154,34,34,0.22)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#9A2222" }}>
                {error}
              </p>
            </div>
          </div>
        ) : null}

        {/* ── HERO ── */}
        <section ref={heroRef} className="relative flex h-[60vh] w-full items-end justify-center overflow-hidden px-4 pb-10 sm:h-[75vh] sm:px-6 sm:pb-20 md:h-[85vh] md:px-10">
          {/* Background — mosaic of lookbook images */}
          <motion.div style={{ y:heroY }} className="absolute inset-0 scale-110">
            <Image
              src={sections[0]?.image || withPublicAssetVersion("/uploads/Jackets & Coats.jpg")}
              alt="Lookbook"
              fill
              className="object-cover"
              style={{ filter:"brightness(0.38) saturate(0.8)" }}
              priority
              sizes="100vw"
            />
          </motion.div>

          <div className="absolute inset-0"
               style={{ background:"radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.7) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-56"
               style={{ background:"linear-gradient(to top, #F5F1E8, transparent)" }} />
          <div className="absolute inset-x-0 top-0 h-24"
               style={{ background:"linear-gradient(to bottom, rgba(61,48,37,0.5), transparent)" }} />

          <motion.div style={{ opacity:heroOpacity }} className="relative z-10 flex flex-col items-center px-4 text-center sm:px-6 md:px-10">
            <div className="mb-7">
              <span
                className="inline-block px-5 py-2 rounded-full text-[9px] text-white/45 tracking-[0.4em] uppercase font-light"
                style={{
                  background:"linear-gradient(135deg, rgba(255,248,236,0.10), rgba(255,248,236,0.03))",
                  backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,248,236,0.10)",
                  boxShadow:"inset 0 1px 0 rgba(255,248,236,0.14)",
                }}
              >
                2025 Season
              </span>
            </div>
            <h1
              className="font-light text-white leading-none mb-4"
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(4rem, 11vw, 9rem)",
                letterSpacing:"0.05em",
                textShadow:"0 4px 48px rgba(0,0,0,0.5)",
              }}
            >
              Look<em style={{ color:"#A87935", fontStyle:"italic" }}>book</em>
            </h1>
            <p className="text-white/35 font-light max-w-xs leading-relaxed"
               style={{ fontSize:"0.82rem", letterSpacing:"0.16em" }}>
              {sections.length} chapters. Each one a statement.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 z-10">
            <span className="text-white text-[9px] tracking-[0.35em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ── CHAPTER INDEX ── */}
        <section className="relative z-10 px-4 py-12 sm:px-6 sm:py-16 md:px-10">
          <motion.div
            initial={false}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            className="max-w-2xl mx-auto flex items-center justify-center gap-6 flex-wrap"
          >
            {sections.map((s, i) => (
              <a key={i} href={`#${s.slug}`}
                 className="group flex items-center gap-2.5 text-white/25 hover:text-white/65 transition-all duration-300">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-[rgba(168,121,53,0.4)]"
                  style={{
                    background:"rgba(255,248,236,0.04)",
                    border:"1px solid rgba(255,248,236,0.07)",
                    fontSize:"8px",
                    color:"rgba(122,88,31,0.88)",
                    fontFamily:"'Cormorant Garamond', serif",
                  }}
                >
                  {s.chapter ?? String(i + 1)}
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase">{s.title}</span>
              </a>
            ))}
          </motion.div>
          <div className="mt-8 mx-auto max-w-xs h-px"
               style={{ background:"linear-gradient(90deg, transparent, rgba(168,121,53,0.2), transparent)" }} />
        </section>

        {/* ── SECTIONS ── */}
        <section className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-16 sm:gap-20 sm:px-6 sm:pb-24 md:gap-28 md:px-10 md:pb-32">
          {sections.map((section, i) => (
            <div key={section.slug || i} id={section.slug}>
              <LookbookSection section={section} index={i} />
            </div>
          ))}
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="relative z-10 overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24 md:px-10"
                 style={{ background:"#FFF9EF" }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:"radial-gradient(ellipse at 50% 100%, rgba(168,121,53,0.05) 0%, transparent 60%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
               style={{ background:"linear-gradient(90deg, transparent, rgba(168,121,53,0.2), transparent)" }} />
          <motion.div
            initial={false}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.9 }}
            className="relative z-10"
          >
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-5">The Full Edit</p>
            <h2
              className="font-light text-white mb-8"
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.8rem, 4vw, 3.2rem)", letterSpacing:"0.06em" }}
            >
              Own the <em style={{ color:"#A87935" }}>Look.</em>
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full transition-all duration-500 hover:scale-[1.02]"
              style={{
                background:"linear-gradient(135deg, rgba(168,121,53,0.18) 0%, rgba(168,121,53,0.06) 100%)",
                backdropFilter:"blur(16px)",
                border:"1px solid rgba(168,121,53,0.28)",
                color:"#A87935",
                fontSize:"10px",
                letterSpacing:"0.3em",
                fontFamily:"'Jost', sans-serif",
              }}
            >
              Shop All Pieces
              <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </section>

      </main>
    </>
  );
}

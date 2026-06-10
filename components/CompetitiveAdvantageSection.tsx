"use client";

import { competitiveScores, editorialAssets, qualityGates } from "@/lib/competitiveScorecard";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const strongestCompetitors = competitiveScores.slice(0, 5);
const customerGates = qualityGates.filter((gate) => ["UI/UX", "Frontend", "Product", "Security"].includes(gate.area));

export default function CompetitiveAdvantageSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#FFF9EF] [content-visibility:auto] [contain-intrinsic-size:980px]">
      <div className="page-wrap">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:items-start">
          <div>
            <p className="eyebrow mb-4">Competitive Standard</p>
            <h2 className="title-display max-w-4xl text-[2.6rem] sm:text-[4.5rem]">
              Better than marketplace shopping.
            </h2>
            <p className="body-copy mt-5 max-w-2xl">
              BOUT is built around sharper curation: premium menswear visuals, local boutique supply, decision support, protected checkout confidence, and styling help that gets customers to the right piece faster.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-gold justify-center">
                Shop Curated Menswear
                <ArrowRight className="h-4 w-4" strokeWidth={1.2} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D5D1C8] bg-white/72 px-6 py-3 text-sm text-[#3D3025] transition hover:border-[#A87935] hover:bg-white"
              >
                Browse Intent Filters
                <Sparkles className="h-4 w-4" strokeWidth={1.2} />
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {editorialAssets.map((asset, index) => (
              <motion.div
                key={asset.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="relative min-h-[13rem] overflow-hidden rounded-[24px] border border-[#7B6752]/12 bg-white/60 shadow-[0_18px_48px_rgba(61,48,37,0.08)]"
              >
                <Image src={asset.src} alt={asset.alt} fill sizes="(max-width: 1024px) 92vw, 38vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1815]/64 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#F8F1E5]">{asset.title}</p>
                  <p className="mt-1 text-[0.72rem] text-[#F8F1E5]/76">{asset.credit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {customerGates.map((gate) => (
            <div key={gate.area} className="rounded-[20px] border border-[#7B6752]/12 bg-white/64 p-5 shadow-[0_12px_32px_rgba(61,48,37,0.05)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[0.24em] text-[#7A581F]">{gate.area}</p>
                <CheckCircle2 className="h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              </div>
              <p className="font-serif text-[1.65rem] font-light text-[#3D3025]">{gate.target}</p>
              <p className="mt-3 text-[0.76rem] leading-6 text-[#6F6254]">{gate.proof}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] border border-[#7B6752]/12 bg-[#FDFBF7]/74 p-4 shadow-[0_18px_48px_rgba(61,48,37,0.07)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 shrink-0 text-[#A87935]" strokeWidth={1.35} />
            <div>
              <p className="eyebrow mb-1">Competitor Read</p>
              <p className="body-copy body-copy-strong">Where BOUT wins: premium focus, local boutiques, styling confidence, and trust.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {strongestCompetitors.map((score) => (
              <div key={score.competitor} className="rounded-[16px] border border-[#7B6752]/12 bg-white/62 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A581F]">{score.competitor}</p>
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#A87935]" strokeWidth={1.25} />
                </div>
                <p className="text-[0.74rem] leading-5 text-[#6F6254]">{score.boutOpportunity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

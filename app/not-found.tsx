"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position:"absolute", width:380, height:380, top:"-15%", right:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter:"blur(100px)", animation:"nfOA 26s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", width:320, height:320, bottom:"-10%", left:"-8%",
        background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"nfOB 32s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes nfOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
        @keyframes nfOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }
      `}</style>
    </div>
  );
}

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #C6A962; color: #080808; }
      `}</style>

      <main
        className="relative flex min-h-screen items-center justify-center bg-[#080808] px-4 sm:px-6 md:px-10"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        <Orbs />

        {/* Radial gold glow behind content */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background:"radial-gradient(ellipse at 50% 55%, rgba(198,169,98,0.06) 0%, transparent 60%)" }} />

        <div className="relative z-10 flex flex-col items-center text-center">

          {/* 404 numeral */}
          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:1.1, ease:[0.22,1,0.36,1] }}
          >
            <p
              className="font-light leading-none select-none"
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(8rem, 22vw, 18rem)",
                color:"rgba(198,169,98,0.12)",
                letterSpacing:"0.06em",
                textShadow:"0 0 120px rgba(198,169,98,0.06)",
              }}
            >
              404
            </p>
          </motion.div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }}
            className="relative -mt-10 flex w-full max-w-sm flex-col items-center gap-6 overflow-hidden rounded-3xl px-6 py-8 sm:px-12 sm:py-10"
            style={{
              background:"linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%)",
              backdropFilter:"blur(28px) saturate(160%)",
              WebkitBackdropFilter:"blur(28px) saturate(160%)",
              border:"1px solid rgba(255,255,255,0.10)",
              boxShadow:"0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.16)",
            }}
          >
            {/* Specular top line */}
            <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent)" }} />

            {/* Eyebrow */}
            <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Lost in the Collection</p>

            {/* Title */}
            <h1
              className="font-light text-white leading-tight"
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"2rem", letterSpacing:"0.06em" }}
            >
              Page <em style={{ color:"#C6A962", fontStyle:"italic" }}>Not Found</em>
            </h1>

            {/* Gold divider */}
            <div className="w-10 h-px"
                 style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.6), transparent)" }} />

            {/* Body */}
            <p className="max-w-xs text-center text-[11px] font-light leading-relaxed text-white/30 sm:text-sm"
               style={{ letterSpacing:"0.06em" }}>
              The page you're looking for doesn't exist or has been moved. Let us take you somewhere worthy of your attention.
            </p>

            {/* CTA */}
            <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              <Link
                href="/"
                className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-6 py-3.5 font-light transition-all duration-400 sm:gap-3 sm:px-8"
                style={{
                  background:"linear-gradient(135deg, rgba(198,169,98,0.20), rgba(198,169,98,0.07))",
                  backdropFilter:"blur(16px)",
                  border:"1px solid rgba(198,169,98,0.32)",
                  boxShadow:"0 0 28px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                  color:"#C6A962",
                  fontSize:"10px",
                  letterSpacing:"0.32em",
                  fontFamily:"'Jost', sans-serif",
                }}
              >
                Return Home
                <ArrowRight strokeWidth={1.3} className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Secondary link */}
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-white/20 text-[9px] tracking-[0.25em] uppercase hover:text-white/45 transition-colors duration-300"
            >
              or Browse the Collection
            </Link>

          </motion.div>
        </div>
      </main>
    </>
  );
}

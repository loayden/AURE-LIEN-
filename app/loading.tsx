"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
      `}</style>

      <div
        className="relative flex min-h-[calc(100svh-64px)] items-center justify-center bg-[#080808]"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{
            position:"absolute", width:340, height:340,
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            background:"radial-gradient(circle, rgba(198,169,98,0.06) 0%, transparent 65%)",
            filter:"blur(80px)",
          }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8">

          {/* Spinner — three concentric arcs */}
          <div className="relative w-16 h-16">
            {/* Outer ring — slow */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{ border:"1px solid rgba(198,169,98,0.15)", borderTopColor:"rgba(198,169,98,0.7)" }}
            />
            {/* Mid ring — medium */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              className="absolute inset-2 rounded-full"
              style={{ border:"1px solid rgba(255,255,255,0.06)", borderTopColor:"rgba(198,169,98,0.35)" }}
            />
            {/* Inner dot */}
            <motion.div
              animate={{ scale:[1, 1.3, 1], opacity:[0.4, 0.8, 0.4] }}
              transition={{ repeat:Infinity, duration:1.8, ease:"easeInOut" }}
              className="absolute inset-[22px] rounded-full"
              style={{ background:"rgba(198,169,98,0.6)" }}
            />
          </div>

          {/* Wordmark */}
          <motion.p
            animate={{ opacity:[0.2, 0.5, 0.2] }}
            transition={{ repeat:Infinity, duration:2.2, ease:"easeInOut" }}
            className="font-light tracking-[0.45em] text-white/30 uppercase text-[10px]"
            style={{ fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.55em" }}
          >
            AURÉLIEN
          </motion.p>

        </div>
      </div>
    </>
  );
}

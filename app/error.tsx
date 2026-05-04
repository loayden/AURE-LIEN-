"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset?: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; background: #F5F1E8; color: #3D3025; font-family: 'Jost', 'Helvetica Neue', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; }
          ::selection { background: #A87935; color: #F5F1E8; }

          @keyframes errOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-28px,22px)} }
          @keyframes errOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(32px,-18px)} }

          .orb-gold {
            position: fixed; width: 380px; height: 380px; top: -15%; right: -10%;
            background: radial-gradient(circle, rgba(168,121,53,0.07) 0%, transparent 65%);
            filter: blur(90px); border-radius: 50%; pointer-events: none;
            animation: errOA 26s ease-in-out infinite;
          }
          .orb-red {
            position: fixed; width: 320px; height: 320px; bottom: -10%; left: -8%;
            background: radial-gradient(circle, rgba(220,60,60,0.06) 0%, transparent 65%);
            filter: blur(80px); border-radius: 50%; pointer-events: none;
            animation: errOB 32s ease-in-out infinite;
          }
          .glow-center {
            position: fixed; inset: 0; pointer-events: none;
            background: radial-gradient(ellipse at 50% 55%, rgba(168,121,53,0.05) 0%, transparent 55%);
          }
        `}</style>
      </head>
      <body>
        {/* Ambient */}
        <div className="orb-gold" />
        <div className="orb-red" />
        <div className="glow-center" />

        {/* Center content */}
        <div
          style={{
            minHeight:"100vh",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            padding:"1.5rem",
            position:"relative",
            zIndex:10,
          }}
        >
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", maxWidth:400, width:"100%" }}>

            {/* Ghost numeral / backdrop */}
            <motion.p
              initial={{ opacity:0, scale:0.88 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:1.1, ease:[0.22,1,0.36,1] }}
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"clamp(6rem,20vw,14rem)",
                fontWeight:300,
                lineHeight:1,
                color:"rgba(220,60,60,0.10)",
                letterSpacing:"0.06em",
                userSelect:"none",
                marginBottom:"-2rem",
              }}
            >
              500
            </motion.p>

            {/* Glass card */}
            <motion.div
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.18, ease:[0.22,1,0.36,1] }}
              style={{
                position:"relative",
                overflow:"hidden",
                borderRadius:24,
                padding:"2.5rem 2.5rem 2rem",
                width:"100%",
                background:"linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(248,241,229,0.56) 100%)",
                backdropFilter:"blur(28px) saturate(160%)",
                WebkitBackdropFilter:"blur(28px) saturate(160%)",
                border:"1px solid rgba(123,103,82,0.18)",
                boxShadow:"0 32px 80px rgba(61,48,37,0.12), inset 0 1px 0 rgba(255,255,255,0.72)",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                gap:"1.25rem",
              }}
            >
              {/* Specular */}
              <div style={{
                position:"absolute", top:0, left:"1.5rem", right:"1.5rem", height:1, pointerEvents:"none",
                background:"linear-gradient(90deg, transparent, rgba(255,248,236,0.22), transparent)",
              }} />

              {/* Warning icon */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                width:44, height:44, borderRadius:14,
                background:"linear-gradient(135deg, rgba(220,60,60,0.16), rgba(200,40,40,0.05))",
                border:"1px solid rgba(220,60,60,0.22)",
                backdropFilter:"blur(12px)",
              }}>
                <AlertTriangle strokeWidth={1.3} style={{ width:20, height:20, color:"rgba(255,100,100,0.75)" }} />
              </div>

              {/* Eyebrow */}
              <p style={{ color:"rgba(61,48,37,0.72)", fontSize:9, letterSpacing:"0.45em", textTransform:"uppercase", fontFamily:"'Jost', sans-serif" }}>
                Application Error
              </p>

              {/* Title */}
              <h1 style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"1.9rem", fontWeight:300, letterSpacing:"0.05em",
                color:"#3D3025", lineHeight:1.1, margin:0,
              }}>
                Something went{" "}
                <em style={{ color:"#7A581F", fontStyle:"italic" }}>wrong</em>
              </h1>

              {/* Divider */}
              <div style={{ width:36, height:1, background:"linear-gradient(90deg, transparent, rgba(168,121,53,0.55), transparent)" }} />

              {/* Error message */}
              {error?.message && (
                <div style={{
                  width:"100%", padding:"10px 14px", borderRadius:12,
                  background:"rgba(255,80,80,0.07)",
                  border:"1px solid rgba(160,40,40,0.18)",
                }}>
                  <p style={{
                    color:"rgba(154,34,34,0.88)", fontSize:11,
                    letterSpacing:"0.05em", fontFamily:"'Jost', sans-serif",
                    fontWeight:300, margin:0, wordBreak:"break-word",
                  }}>
                    {error.message}
                  </p>
                </div>
              )}

              {/* Body */}
              <p style={{
                color:"rgba(61,48,37,0.78)", fontSize:13, fontWeight:300,
                lineHeight:1.7, letterSpacing:"0.06em", margin:0, maxWidth:280,
              }}>
                An unexpected error occurred. Try refreshing the page or return home.
              </p>

              {/* CTAs */}
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem", width:"100%", alignItems:"center", marginTop:"0.25rem" }}>

                {/* Retry — only show if reset is available */}
                {reset && (
                  <button
                    type="button"
                    onClick={reset}
                    style={{
                      display:"inline-flex", alignItems:"center", gap:10,
                      padding:"12px 32px", borderRadius:9999,
                      background:"linear-gradient(135deg, rgba(168,121,53,0.20), rgba(168,121,53,0.07))",
                      backdropFilter:"blur(16px)",
                      border:"1px solid rgba(168,121,53,0.32)",
                      boxShadow:"0 0 28px rgba(168,121,53,0.12), inset 0 1px 0 rgba(255,248,236,0.14)",
                      color:"#7A581F",
                      fontSize:10, letterSpacing:"0.32em", textTransform:"uppercase",
                      fontFamily:"'Jost', sans-serif", fontWeight:300,
                      transition:"transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.015)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                  >
                    <RotateCcw strokeWidth={1.3} style={{ width:14, height:14 }} />
                    Try Again
                  </button>
                )}

                {/* Go home */}
                <a
                  href="/"
                  style={{
                    display:"inline-flex", alignItems:"center", gap:10,
                    padding:"11px 28px", borderRadius:9999,
                    background:"linear-gradient(135deg, rgba(255,255,255,0.62), rgba(248,241,229,0.44))",
                    backdropFilter:"blur(14px)",
                    border:"1px solid rgba(123,103,82,0.18)",
                    color:"rgba(61,48,37,0.78)",
                    fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase",
                    fontFamily:"'Jost', sans-serif", fontWeight:300,
                    textDecoration:"none",
                    transition:"color 0.3s, border-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(61,48,37,0.94)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,121,53,0.32)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(61,48,37,0.78)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,103,82,0.18)";
                  }}
                >
                  Return Home
                  <ArrowRight strokeWidth={1.3} style={{ width:13, height:13 }} />
                </a>
              </div>

            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}

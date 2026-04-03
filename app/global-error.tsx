"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0A0908",
          color: "#fff",
          fontFamily: "var(--font-jost), 'Jost', sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "min(100%, 420px)",
              borderRadius: 24,
              padding: "2rem",
              background:
                "linear-gradient(135deg, rgba(255,248,236,0.08) 0%, rgba(255,248,236,0.025) 100%)",
              border: "1px solid rgba(255,248,236,0.09)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,248,236,0.15)",
              backdropFilter: "blur(28px) saturate(160%)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                background: "linear-gradient(135deg, rgba(220,60,60,0.16), rgba(200,40,40,0.05))",
                border: "1px solid rgba(220,60,60,0.22)",
              }}
            >
              <AlertTriangle strokeWidth={1.3} className="h-5 w-5" style={{ color: "rgba(255,100,100,0.75)" }} />
            </div>

            <p style={{ margin: 0, color: "rgba(255,248,236,0.22)", fontSize: 9, letterSpacing: "0.45em", textTransform: "uppercase" }}>
              Critical Error
            </p>
            <h1
              style={{
                margin: "0.9rem 0 0",
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 300,
                letterSpacing: "0.05em",
              }}
            >
              Application <em style={{ color: "#C9A86A", fontStyle: "italic" }}>recovered</em>
            </h1>
            <p style={{ margin: "1rem 0 0", color: "rgba(255,248,236,0.36)", lineHeight: 1.7, letterSpacing: "0.04em" }}>
              A fatal rendering error was caught before the whole shell failed. Retry the route or return home.
            </p>

            {error?.message ? (
              <p
                style={{
                  margin: "1rem 0 0",
                  padding: "0.8rem 0.9rem",
                  borderRadius: 14,
                  background: "rgba(255,248,236,0.03)",
                  border: "1px solid rgba(255,248,236,0.06)",
                  color: "rgba(255,100,100,0.68)",
                  fontSize: 12,
                  wordBreak: "break-word",
                }}
              >
                {error.message}
              </p>
            ) : null}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minHeight: 44,
                  padding: "0.85rem 1.15rem",
                  borderRadius: 9999,
                  background: "linear-gradient(135deg, rgba(201,168,106,0.22), rgba(201,168,106,0.08))",
                  border: "1px solid rgba(201,168,106,0.35)",
                  color: "#C9A86A",
                  boxShadow: "0 0 28px rgba(201,168,106,0.12), inset 0 1px 0 rgba(255,248,236,0.14)",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                <RotateCcw strokeWidth={1.3} className="h-4 w-4" />
                Try Again
              </button>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minHeight: 44,
                  padding: "0.85rem 1.15rem",
                  borderRadius: 9999,
                  background: "linear-gradient(135deg, rgba(255,248,236,0.07), rgba(255,248,236,0.02))",
                  border: "1px solid rgba(255,248,236,0.09)",
                  color: "rgba(255,248,236,0.65)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Return Home
                <ArrowRight strokeWidth={1.3} className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}

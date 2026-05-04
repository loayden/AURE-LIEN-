"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.dispatchEvent(new Event("wishlist:invalidate"));
      router.push(redirect || (data?.user?.role === "admin" ? "/admin" : "/account"));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        body { background: #F5F1E8; }
        ::selection { background: #A87935; color: #F5F1E8; }
      `}</style>

      <main
        className="relative min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 md:px-10"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(160deg, rgba(255,248,236,0.09) 0%, rgba(255,248,236,0.025) 60%, transparent 100%)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
            border: "1px solid rgba(255,248,236,0.10)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,248,236,0.18)",
          }}
        >
          {/* Specular top line */}
          <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
               style={{ background: "linear-gradient(90deg, transparent, rgba(255,248,236,0.28), transparent)" }} />

          <div className="px-5 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-10">

            {/* Brand */}
            <div className="text-center mb-8">
              <h1
                className="font-light text-white leading-none mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.2rem",
                  letterSpacing: "0.12em",
                }}
              >
                BOUT
              </h1>
              <div className="mx-auto mt-3 mb-4 w-8 h-px"
                   style={{ background: "linear-gradient(90deg, transparent, rgba(168,121,53,0.7), transparent)" }} />
              <p className="text-white/25 text-[9px] tracking-[0.45em] uppercase">Sign In</p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5 flex items-center gap-2 px-4 py-3 rounded-2xl overflow-hidden sm:gap-3"
                  style={{
                    background: "rgba(255,60,60,0.07)",
                    border: "1px solid rgba(255,80,80,0.18)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <AlertCircle strokeWidth={1.3} className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
                  <p className="text-red-400/70 text-[10px] tracking-[0.2em] font-light">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-white/25 text-[9px] tracking-[0.4em] uppercase">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="glass-input"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/25 text-[9px] tracking-[0.4em] uppercase">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-white/20 text-[9px] tracking-[0.2em] uppercase hover:text-[#A87935] transition-colors duration-300"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="glass-input"
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] text-white/25 transition-colors duration-300 hover:text-white/55"
                  >
                    {showPassword
                      ? <EyeOff strokeWidth={1.3} className="w-4 h-4" />
                      : <Eye strokeWidth={1.3} className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="relative mt-2 flex min-h-[44px] min-w-[44px] w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 transition-all duration-500 disabled:opacity-50 sm:gap-3"
                style={{
                  background: "linear-gradient(135deg, rgba(168,121,53,0.22), rgba(178,149,78,0.10))",
                  border: "1px solid rgba(168,121,53,0.35)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 0 28px rgba(168,121,53,0.12), inset 0 1px 0 rgba(255,248,236,0.14)",
                }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,248,236,0.08) 50%, transparent 60%)" }} />
                <span className="relative z-10 text-[#A87935] text-[10px] tracking-[0.32em] uppercase font-light">
                  {loading ? "Signing In…" : "Sign In"}
                </span>
                {!loading && (
                  <ArrowRight strokeWidth={1.3} className="relative z-10 w-3.5 h-3.5 text-[#A87935]" />
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px" style={{ background: "rgba(255,248,236,0.06)" }} />
              <span className="text-white/15 text-[9px] tracking-[0.3em] uppercase">or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,248,236,0.06)" }} />
            </div>

            {/* Sign up link */}
            <p className="text-center text-white/25 text-[10px] tracking-[0.2em]">
              No account?{" "}
              <Link
                href="/signup"
                className="text-[#A87935] hover:text-white/80 transition-colors duration-300"
                style={{ letterSpacing: "0.2em" }}
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>

      </main>
    </>
  );
}

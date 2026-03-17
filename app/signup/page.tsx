"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position:"absolute", width:650, height:650, top:"-15%", left:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 65%)",
        filter:"blur(90px)", animation:"suOA 24s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", width:500, height:500, bottom:"-10%", right:"-8%",
        background:"radial-gradient(circle, rgba(150,140,220,0.06) 0%, transparent 65%)",
        filter:"blur(80px)", animation:"suOB 30s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes suOA { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-25px)} }
        @keyframes suOB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-35px,20px)} }
      `}</style>
    </div>
  );
}

/* ── Password strength ── */
const STRENGTH_CONFIG = [
  { label: "Weak",   color: "rgba(255,80,80,0.7)",    bg: "rgba(255,80,80,0.15)"   },
  { label: "Fair",   color: "rgba(255,180,50,0.75)",   bg: "rgba(255,180,50,0.15)"  },
  { label: "Strong", color: "rgba(80,200,120,0.75)",   bg: "rgba(80,200,120,0.12)"  },
];

function StrengthBar({ password }: { password: string }) {
  const strength = password.length === 0 ? -1 : password.length < 8 ? 0 : password.length < 12 ? 1 : 2;
  if (strength === -1) return null;
  const cfg = STRENGTH_CONFIG[strength];
  return (
    <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} className="mt-3 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[0,1,2].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden"
               style={{ background:"rgba(255,255,255,0.06)" }}>
            <motion.div
              initial={{ scaleX:0 }}
              animate={{ scaleX: i <= strength ? 1 : 0 }}
              transition={{ duration:0.4, delay: i * 0.08, ease:[0.22,1,0.36,1] }}
              className="h-full origin-left rounded-full"
              style={{ background: cfg.color }}
            />
          </div>
        ))}
      </div>
      <p className="text-[9px] tracking-[0.28em] uppercase font-light" style={{ color: cfg.color }}>
        {cfg.label}
      </p>
    </motion.div>
  );
}

/* ── Field wrapper ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/25 text-[9px] tracking-[0.4em] uppercase"
             style={{ fontFamily:"'Jost', sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');
        body { background: #080808; }
        ::selection { background: #C6A962; color: #080808; }

        .glass-input {
          width: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 14px 18px;
          color: rgba(255,255,255,0.80);
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.35s, box-shadow 0.35s;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.18); }
        .glass-input:focus {
          border-color: rgba(198,169,98,0.5);
          box-shadow: 0 0 0 3px rgba(198,169,98,0.08);
        }
        .glass-input.match {
          border-color: rgba(80,200,120,0.4);
          box-shadow: 0 0 0 3px rgba(80,200,120,0.07);
        }
        .glass-input.mismatch {
          border-color: rgba(255,80,80,0.4);
          box-shadow: 0 0 0 3px rgba(255,80,80,0.07);
        }
      `}</style>

      <main
        className="relative min-h-screen bg-[#080808] flex items-center justify-center px-6 py-24"
        style={{ fontFamily:"'Jost', sans-serif" }}
      >
        <Orbs />

        <motion.div
          initial={{ opacity:0, y:28, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl"
          style={{
            background:"linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 60%, transparent 100%)",
            backdropFilter:"blur(32px) saturate(160%)",
            WebkitBackdropFilter:"blur(32px) saturate(160%)",
            border:"1px solid rgba(255,255,255,0.10)",
            boxShadow:"0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {/* Specular top line */}
          <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
               style={{ background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }} />

          <div className="px-8 pt-10 pb-10">

            {/* Brand header */}
            <div className="text-center mb-8">
              <h1
                className="font-light text-white leading-none mb-2"
                style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"2.2rem", letterSpacing:"0.12em" }}
              >
                AURÉLIEN
              </h1>
              <div className="mx-auto mt-3 mb-4 w-8 h-px"
                   style={{ background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.7), transparent)" }} />
              <p className="text-white/25 text-[9px] tracking-[0.45em] uppercase">Create Account</p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity:0, y:-8, height:0 }}
                  animate={{ opacity:1, y:0, height:"auto" }}
                  exit={{ opacity:0, y:-8, height:0 }}
                  transition={{ duration:0.3 }}
                  className="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl overflow-hidden"
                  style={{ background:"rgba(255,60,60,0.07)", border:"1px solid rgba(255,80,80,0.18)", backdropFilter:"blur(12px)" }}
                >
                  <AlertCircle strokeWidth={1.3} className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
                  <p className="text-red-400/70 text-[10px] tracking-[0.2em] font-light">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Full Name */}
              <Field label="Full Name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  className="glass-input"
                />
              </Field>

              {/* Email */}
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="glass-input"
                />
              </Field>

              {/* Password */}
              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    required
                    className="glass-input"
                    style={{ paddingRight:48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors duration-300"
                  >
                    {showPassword
                      ? <EyeOff strokeWidth={1.3} className="w-4 h-4" />
                      : <Eye strokeWidth={1.3} className="w-4 h-4" />
                    }
                  </button>
                </div>
                <StrengthBar password={password} />
              </Field>

              {/* Confirm Password */}
              <Field label="Confirm Password">
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                    className={`glass-input ${passwordsMatch ? "match" : passwordsMismatch ? "mismatch" : ""}`}
                    style={{ paddingRight:80 }}
                  />
                  {/* Match indicator */}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <AnimatePresence mode="wait">
                      {passwordsMatch && (
                        <motion.span key="ok" initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
                          <CheckCircle2 strokeWidth={1.3} className="w-4 h-4" style={{ color:"rgba(80,200,120,0.7)" }} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors duration-300"
                  >
                    {showConfirm
                      ? <EyeOff strokeWidth={1.3} className="w-4 h-4" />
                      : <Eye strokeWidth={1.3} className="w-4 h-4" />
                    }
                  </button>
                </div>
                <AnimatePresence>
                  {passwordsMismatch && (
                    <motion.p
                      initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="text-[9px] tracking-[0.25em] uppercase font-light"
                      style={{ color:"rgba(255,80,80,0.65)" }}
                    >
                      Passwords don't match
                    </motion.p>
                  )}
                </AnimatePresence>
              </Field>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale:1.015 }}
                whileTap={{ scale:0.985 }}
                className="relative mt-2 w-full overflow-hidden rounded-full py-4 flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-500"
                style={{
                  background:"linear-gradient(135deg, rgba(198,169,98,0.22), rgba(178,149,78,0.10))",
                  border:"1px solid rgba(198,169,98,0.35)",
                  backdropFilter:"blur(16px)",
                  boxShadow:"0 0 28px rgba(198,169,98,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
                }}
              >
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }} />
                <span className="relative z-10 text-[#C6A962] text-[10px] tracking-[0.32em] uppercase font-light">
                  {loading ? "Creating Account…" : "Create Account"}
                </span>
                {!loading && <ArrowRight strokeWidth={1.3} className="relative z-10 w-3.5 h-3.5 text-[#C6A962]" />}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }} />
              <span className="text-white/15 text-[9px] tracking-[0.3em] uppercase">or</span>
              <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }} />
            </div>

            {/* Sign in link */}
            <p className="text-center text-white/25 text-[10px] tracking-[0.2em]">
              Already have an account?{" "}
              <Link href="/login"
                className="text-[#C6A962] hover:text-white/80 transition-colors duration-300"
                style={{ letterSpacing:"0.2em" }}>
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}

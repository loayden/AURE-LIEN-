"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not reset password");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset password");
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <p className="mx-auto mt-5 max-w-sm text-sm font-light leading-7 text-[#6F6257]">
        This reset link is missing its token. Request a new one from the forgot-password page.
      </p>
    );
  }

  if (done) {
    return (
      <div className="mt-6">
        <p className="mx-auto max-w-sm text-sm font-light leading-7 text-[#6F6257]">
          Password updated. All other sessions were signed out.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-8 py-3 text-[10px] uppercase tracking-[0.24em] text-[#FFF8EC]"
          style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 text-left">
      <label className="mb-2 block text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }} htmlFor="reset-password">
        New password (min 8 characters)
      </label>
      <input
        id="reset-password"
        type="password"
        name="new-password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="A long, unique phrase…"
        className="min-h-[52px] w-full rounded-[14px] border px-5 text-[0.95rem] text-[#3D3025] outline-none"
        style={{ border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.7)" }}
      />
      <label className="mb-2 mt-4 block text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--gold-text)" }} htmlFor="reset-confirm">
        Confirm password
      </label>
      <input
        id="reset-confirm"
        type="password"
        name="new-password-confirm"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repeat it…"
        className="min-h-[52px] w-full rounded-[14px] border px-5 text-[0.95rem] text-[#3D3025] outline-none"
        style={{ border: "1px solid rgba(123,103,82,0.22)", background: "rgba(255,255,255,0.7)" }}
      />
      {error ? (
        <p className="mt-2 text-sm text-[#9A2222]" role="alert">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-[#FFF8EC] transition disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #4C3A26, #7D592B)" }}
      >
        {busy ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      className="relative flex min-h-[calc(100svh-54px)] items-start justify-center bg-[#F5F1E8] px-4 pb-36 pt-10 sm:min-h-[calc(100svh-58px)] sm:items-center sm:px-6 sm:py-16 md:px-10"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, rgba(168,121,53,0.10), transparent 38%), linear-gradient(135deg, rgba(255,248,236,0.78), rgba(245,241,232,0.92))",
        }}
      />
      <section className="glass-panel relative z-10 w-full max-w-md overflow-hidden px-5 py-6 text-center sm:px-8 sm:py-10">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#A87935]/25 bg-[#FFF8EC]/70 text-[#A87935]">
          <ShieldCheck className="h-5 w-5" strokeWidth={1.3} />
        </div>
        <p className="mb-4 text-[9px] uppercase tracking-[0.42em] text-[#A87935]">
          New Password
        </p>
        <h1
          className="font-light leading-tight text-[#171412]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.75rem, 6vw, 2.65rem)", letterSpacing: "0.04em" }}
        >
          Choose access again.
        </h1>
        <Suspense fallback={<p className="mt-5 text-sm text-[#6F6257]">Loading…</p>}>
          <ResetForm />
        </Suspense>
        <Link
          href="/login"
          className="mx-auto mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 px-4 text-[10px] uppercase tracking-[0.28em] text-[#7B6E60] transition hover:text-[#A87935]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
      </section>
    </main>
  );
}

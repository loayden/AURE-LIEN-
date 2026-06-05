import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | BOUT",
  description: "Recover access to your BOUT account.",
};

export default function ForgotPasswordPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@boutique-eg.com";

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
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#A87935]/25 bg-[#FFF8EC]/70 text-[#A87935] shadow-[0_18px_40px_rgba(61,48,37,0.10)] sm:h-14 sm:w-14">
          <ShieldCheck className="h-5 w-5" strokeWidth={1.3} />
        </div>

        <p className="mb-4 text-[9px] uppercase tracking-[0.42em] text-[#A87935]">
          Account Recovery
        </p>
        <h1
          className="font-light leading-tight text-[#171412]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.75rem, 6vw, 2.65rem)",
            letterSpacing: "0.04em",
          }}
        >
          Reset access safely.
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-sm font-light leading-7 text-[#6F6257]">
          Password reset automation is being protected before launch. Send the account email to support and an admin will verify the request before changing access.
        </p>

        <div className="mt-7 rounded-2xl border border-[#A87935]/18 bg-[#FFF8EC]/64 p-4 text-left">
          <p className="text-[9px] uppercase tracking-[0.34em] text-[#A87935]">Support Email</p>
          <a
            href={`mailto:${supportEmail}?subject=BOUT password reset request`}
            className="mt-3 flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#A87935]/25 bg-[#4C3A26] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-[#FFF8EC] transition hover:bg-[#3D3025]"
          >
            <Mail className="h-4 w-4" strokeWidth={1.3} />
            Email Support
          </a>
        </div>

        <Link
          href="/login"
          className="mx-auto mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 px-4 text-[10px] uppercase tracking-[0.28em] text-[#7B6E60] transition hover:text-[#A87935]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.3} />
          Back to Login
        </Link>
      </section>
    </main>
  );
}

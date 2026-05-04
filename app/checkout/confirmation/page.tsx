"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, CreditCard, Hash, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const paymentStatus = searchParams.get("paymentStatus") || (searchParams.get("session_id") ? "paid" : "pending");
  const paid = paymentStatus === "paid";

  return (
    <main className="liquid-page flex min-h-screen items-center px-4 py-24 sm:px-6 md:px-10">
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="page-wrap max-w-3xl"
      >
        <div className="glass-panel p-6 text-center sm:p-9">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{
              background: paid ? "rgba(80,200,120,0.1)" : "rgba(168,121,53,0.12)",
              border: paid ? "1px solid rgba(80,200,120,0.22)" : "1px solid rgba(168,121,53,0.28)",
            }}
          >
            {paid ? (
              <CheckCircle2 className="h-8 w-8 text-[rgba(110,220,145,0.86)]" strokeWidth={1.25} />
            ) : (
              <Clock3 className="h-8 w-8 text-[#A87935]" strokeWidth={1.25} />
            )}
          </div>

          <p className="eyebrow mb-4">Order Confirmation</p>
          <h1 className="title-display text-[clamp(2.4rem,7vw,4.8rem)]">
            Order <em className="gold-italic">{paid ? "paid" : "received"}</em>
          </h1>
          <p className="body-copy mx-auto mt-5 max-w-xl text-center">
            {paid
              ? "Your card payment was completed. Keep the confirmation details below for support."
              : "Your order was created and is waiting for payment on delivery or manual confirmation."}
          </p>

          <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
              <Hash className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              <p className="eyebrow mb-2">Order Number</p>
              <p className="break-all text-sm tracking-[0.08em] text-white/72">
                {orderId || "Stripe session order"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
              <CreditCard className="mb-3 h-4 w-4 text-[#A87935]" strokeWidth={1.35} />
              <p className="eyebrow mb-2">Payment Status</p>
              <p className="text-sm uppercase tracking-[0.16em] text-white/72">
                {paid ? "Paid" : "Pending"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={orderId ? `/orders?orderId=${encodeURIComponent(orderId)}` : "/orders"} className="btn-gold justify-center">
              View Orders
              <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
            </Link>
            <Link href="/shop" className="btn-ghost justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/28">
          <PackageCheck className="h-3.5 w-3.5" strokeWidth={1.3} />
          Pending orders can be reviewed from your account.
        </div>
      </motion.section>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<main className="liquid-page flex min-h-screen items-center justify-center"><p className="eyebrow">Loading Confirmation</p></main>}>
      <ConfirmationContent />
    </Suspense>
  );
}

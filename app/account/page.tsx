"use client";

import { motion } from "framer-motion";
import { ArrowRight, LogOut, MapPin, Package2, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    address?: string;
    apartment?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/users/me", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setUser)
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        if (requestError instanceof Error && requestError.message === "Unauthorized") {
          router.push("/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load account");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.dispatchEvent(new Event("wishlist:invalidate"));
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="liquid-page pt-24">
        <div className="page-wrap flex min-h-[55vh] items-center justify-center">
          <p className="eyebrow">Loading Account</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
        <div className="page-wrap max-w-3xl">
          <div className="glass-panel p-6 sm:p-8">
            <p className="eyebrow mb-4">Private Account</p>
            <h1 className="title-display text-[2.4rem]">
              Account <em className="gold-italic">Unavailable</em>
            </h1>
            <div className="page-header-divider mt-6" />
            <p className="body-copy mt-6">
              {error || "We could not load your account details right now. Please refresh or sign in again."}
            </p>
            <div className="mt-6">
              <Link href="/login" className="btn-gold">
                Sign In Again
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 md:px-10">
      <div className="page-wrap max-w-5xl">
        {error ? (
          <div
            className="mb-5 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,60,60,0.07)", border: "1px solid rgba(255,80,80,0.18)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,120,120,0.75)" }}>
              {error}
            </p>
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <p className="eyebrow mb-4">Private Account</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1
              className="title-display"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.8rem)" }}
            >
              Maison <em className="gold-italic">Account</em>
            </h1>
            <span className="count-pill">Member Profile</span>
          </div>
          <div className="page-header-divider mt-6" />
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-panel p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="empty-icon-panel h-12 w-12 rounded-[1rem]">
                <User2 strokeWidth={1.2} className="h-5 w-5 text-[#C9A86A]" />
              </div>
              <div>
                <p className="eyebrow mb-2">Profile</p>
                <p className="body-copy body-copy-strong">Your account details and delivery profile.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="eyebrow mb-2">Name</p>
                <p className="body-copy body-copy-strong">{user.name}</p>
              </div>
              <div className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="eyebrow mb-2">Email</p>
                <p className="body-copy body-copy-strong break-all">{user.email}</p>
              </div>
              <div className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="eyebrow mb-2">Phone</p>
                <p className="body-copy body-copy-strong">{user.phone || "Not added yet"}</p>
              </div>
              <div className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="eyebrow mb-2">Location</p>
                <p className="body-copy body-copy-strong">
                  {[user.city, user.country].filter(Boolean).join(", ") || "Not added yet"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2">
                <MapPin strokeWidth={1.2} className="h-4 w-4 text-[#C9A86A]" />
                <p className="eyebrow">Delivery Address</p>
              </div>
              <p className="body-copy body-copy-strong">
                {[user.address, user.apartment, user.city, user.postalCode, user.country]
                  .filter(Boolean)
                  .join(", ") || "Add an address during checkout to save it here."}
              </p>
            </div>
          </section>

          <section className="dark-panel flex flex-col gap-4 p-6 sm:p-7">
            <div>
              <p className="eyebrow mb-3">Client Services</p>
              <h2 className="title-display text-[2rem]">
                Account <em className="gold-italic">Access</em>
              </h2>
            </div>
            <p className="body-copy">
              Move through your recent activity without leaving the same visual system as the storefront.
            </p>

            <nav className="flex flex-col gap-3">
              <Link href="/orders" className="liquid-row-link">
                <span className="inline-flex items-center gap-3">
                  <Package2 strokeWidth={1.2} className="h-4 w-4 text-[#C9A86A]" />
                  <span className="text-[0.82rem] uppercase tracking-[0.24em]">Order History</span>
                </span>
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-white/35" />
              </Link>
              <Link href="/wishlist" className="liquid-row-link">
                <span className="inline-flex items-center gap-3">
                  <User2 strokeWidth={1.2} className="h-4 w-4 text-[#C9A86A]" />
                  <span className="text-[0.82rem] uppercase tracking-[0.24em]">Wishlist</span>
                </span>
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 text-white/35" />
              </Link>
            </nav>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="btn-gold mt-auto w-full justify-center"
            >
              <LogOut strokeWidth={1.2} className="h-4 w-4" />
              Sign Out
            </motion.button>
          </section>
        </div>
      </div>
    </main>
  );
}

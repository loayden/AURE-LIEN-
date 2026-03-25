"use client";

import { motion } from "framer-motion";
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

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setUser)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("wishlist:invalidate"));
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-ivory flex items-center justify-center pt-24">
        <p className="tracking-widest text-silver">Loading...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-ivory pt-16 pb-16 px-4 sm:pt-24 sm:pb-20 sm:px-6 md:px-10">
      <div className="max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-display-md tracking-luxury-wide border-b border-brass/30 pb-4 sm:pb-6 mb-6 sm:mb-8 md:mb-10"
        >
          Account
        </motion.h1>

        <section className="mb-10 space-y-6 sm:mb-12 sm:space-y-8">
          <h2 className="text-xs uppercase tracking-widest text-silver">Profile</h2>
          <p className="text-ivory font-light">{user.name}</p>
          <p className="text-ivory-muted">{user.email}</p>
          {user.phone && <p className="text-ivory-muted">{user.phone}</p>}
          {(user.address || user.city || user.country) && (
            <p className="text-ivory-muted">
              {[user.address, user.apartment, user.city, user.postalCode, user.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </section>

        <nav className="mb-10 space-y-3 sm:mb-12 sm:space-y-4">
          <Link
            href="/orders"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-brass/30 py-4 text-center font-serif tracking-wide text-ivory transition-colors hover:bg-brass/10"
          >
            Order History
          </Link>
          <Link
            href="/wishlist"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-brass/30 py-4 text-center font-serif tracking-wide text-ivory transition-colors hover:bg-brass/10"
          >
            Wishlist
          </Link>
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full min-h-[44px] min-w-[44px] border border-brass py-4 text-sm font-serif uppercase tracking-widest text-brass transition-colors hover:bg-brass hover:text-black"
        >
          Sign Out
        </motion.button>
      </div>
    </main>
  );
}

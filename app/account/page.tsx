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
    <main className="min-h-screen bg-black text-ivory pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-display-md tracking-luxury-wide border-b border-brass/30 pb-6 mb-12"
        >
          Account
        </motion.h1>

        <section className="space-y-8 mb-16">
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

        <nav className="space-y-4 mb-16">
          <Link
            href="/orders"
            className="block py-4 border border-brass/30 text-ivory font-serif tracking-wide hover:bg-brass/10 transition-colors text-center"
          >
            Order History
          </Link>
          <Link
            href="/wishlist"
            className="block py-4 border border-brass/30 text-ivory font-serif tracking-wide hover:bg-brass/10 transition-colors text-center"
          >
            Wishlist
          </Link>
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full py-4 border border-brass text-brass font-serif tracking-widest uppercase text-sm hover:bg-brass hover:text-black transition-colors"
        >
          Sign Out
        </motion.button>
      </div>
    </main>
  );
}

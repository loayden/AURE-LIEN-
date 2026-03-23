"use client";

import { ChevronDown, Eye, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminUser {
  _id: string;
  accountId: string | null;
  name: string;
  email: string;
  createdAt: string;
  lastOrderAt: string;
  orders: number;
  totalSpent: number;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  source: "account" | "guest";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const q = new URLSearchParams();
        if (search) q.set("search", search);
        if (sort) q.set("sort", sort);

        const response = await fetch(`/api/admin/users?${q}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || data?.message || "Failed to load users");
        }

        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setUsers([]);
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [search, sort]);

  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(2)}`;
    } catch {
      return "-";
    }
  };

  const formatLocation = (user: AdminUser) => {
    return [user.address, user.city, user.country].filter(Boolean).join(" • ") || "-";
  };

  const formatSource = (user: AdminUser) => {
    return user.source === "account" ? "Account" : "Guest";
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-brass/30 pb-4">
        <h1 className="text-xl font-serif font-light tracking-luxury-wide sm:text-2xl">
          Users
        </h1>
        <p className="text-ivory-muted text-sm mt-1">
          Unified customer records across registered accounts and guest checkouts
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[44px] min-w-[44px] rounded-lg border border-brass/30 bg-charcoal py-2.5 pl-10 pr-4 text-base text-ivory placeholder:text-ivory-muted/60 focus:border-brass focus:outline-none sm:w-72 sm:text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="min-h-[44px] min-w-[44px] w-full appearance-none rounded-lg border border-brass/30 bg-charcoal py-2.5 pl-4 pr-10 text-base text-ivory focus:border-brass focus:outline-none sm:w-48 sm:text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="orders">Most orders</option>
            <option value="spent">Most spent</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted pointer-events-none" />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-brass/20 bg-charcoal-light/30 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ivory-muted tracking-wide">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-ivory-muted tracking-wide">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brass/20 bg-black/20">
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Name</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Email</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Phone</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Address</th>
                  <th className="text-center py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Orders</th>
                  <th className="text-right py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Total Spent</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Last Activity</th>
                  <th className="text-center py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-brass/10 hover:bg-brass/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <p className="text-ivory font-light">{u.name}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-brass/80">
                          {formatSource(u)}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-ivory-muted text-sm">
                        {u.email || <span className="text-ivory-muted/60">No email</span>}
                      </td>
                      <td className="py-4 px-6 text-ivory-muted text-sm">{u.phone || "-"}</td>
                      <td className="py-4 px-6 text-ivory-muted text-sm min-w-[240px]">
                        {formatLocation(u)}
                      </td>
                    <td className="py-4 px-6 text-center text-ivory">{u.orders}</td>
                    <td className="py-4 px-6 text-right text-brass font-light">EGP {u.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-6 text-ivory-muted text-sm">
                      {formatDate(u.lastOrderAt || u.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/admin/users/${u._id}/orders`}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg border border-brass/50 px-4 py-2 text-[11px] tracking-wide text-brass transition-colors hover:bg-brass/10 sm:text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

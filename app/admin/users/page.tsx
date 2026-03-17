"use client";

import { ChevronDown, Eye, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  orders: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (sort) q.set("sort", sort);
    fetch(`/api/admin/users?${q}`)
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [search, sort]);

  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(2)}`;
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-brass/30 pb-4">
        <h1 className="text-2xl font-serif font-light tracking-luxury-wide">
          Users
        </h1>
        <p className="text-ivory-muted text-sm mt-1">
          Everyone who placed an order (with or without an account)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-charcoal border border-brass/30 rounded-lg text-ivory placeholder:text-ivory-muted/60 focus:outline-none focus:border-brass"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 bg-charcoal border border-brass/30 rounded-lg text-ivory focus:outline-none focus:border-brass"
          >
            <option value="newest">Newest first</option>
            <option value="orders">Most orders</option>
            <option value="spent">Most spent</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted pointer-events-none" />
        </div>
      </div>

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
                  <th className="text-center py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Orders</th>
                  <th className="text-right py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Total Spent</th>
                  <th className="text-left py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Joined</th>
                  <th className="text-center py-4 px-6 text-xs uppercase tracking-widest text-brass font-light">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-brass/10 hover:bg-brass/5 transition-colors"
                  >
                    <td className="py-4 px-6 text-ivory font-light">{u.name}</td>
                    <td className="py-4 px-6 text-ivory-muted text-sm">{u.email}</td>
                    <td className="py-4 px-6 text-center text-ivory">{u.orders}</td>
                    <td className="py-4 px-6 text-right text-brass font-light">EGP {u.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-6 text-ivory-muted text-sm">{formatDate(u.createdAt)}</td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/admin/users/${u._id}/orders`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-brass/50 text-brass text-sm tracking-wide hover:bg-brass/10 transition-colors rounded-lg"
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

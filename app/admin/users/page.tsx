"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Eye, Search } from "lucide-react";
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
      <AdminPageHeader
        title="Customer Records"
        description="Unified client profiles across registered accounts and guest checkouts."
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-11 pr-4 sm:w-72"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="luxury-select w-full py-3 pl-4 pr-10 sm:w-48"
          >
            <option value="newest">Newest first</option>
            <option value="orders">Most orders</option>
            <option value="spent">Most spent</option>
          </select>
        </div>
      </div>

      {error ? <AdminBanner message={error} /> : null}

      <div className="admin-table-shell">
        {loading ? (
          <div className="p-12 text-center"><p className="eyebrow">Loading Users</p></div>
        ) : users.length === 0 ? (
          <div className="p-6 sm:p-8">
            <AdminEmptyState
              title="No User Records"
              description="Customer records will appear here once account creation or checkout activity begins."
              icon={Eye}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th className="text-center">Orders</th>
                  <th className="text-right">Total Spent</th>
                  <th>Last Activity</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                  >
                      <td>
                        <p className="body-copy body-copy-strong">{u.name}</p>
                        <p className="eyebrow mt-2" style={{ color: "rgba(198,169,98,0.85)" }}>
                          {formatSource(u)}
                        </p>
                      </td>
                      <td className="text-sm">
                        {u.email || <span className="text-ivory-muted/60">No email</span>}
                      </td>
                      <td className="text-sm">{u.phone || "-"}</td>
                      <td className="min-w-[240px] text-sm">
                        {formatLocation(u)}
                      </td>
                    <td className="text-center text-white/78">{u.orders}</td>
                    <td className="text-right text-[#C6A962]">EGP {u.totalSpent.toLocaleString()}</td>
                    <td className="text-sm">
                      {formatDate(u.lastOrderAt || u.createdAt)}
                    </td>
                    <td className="text-center">
                      <Link
                        href={`/admin/users/${u._id}/orders`}
                        className="btn-ghost inline-flex justify-center px-4"
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

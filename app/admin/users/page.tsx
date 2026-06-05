"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { showToast } from "@/components/ToastProvider";
import { AlertTriangle, Eye, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  accountIntent: "buyer" | "partner" | "both";
  deviceAccountWarning: string;
  source: "account" | "guest";
}

const CLEAR_CUSTOMER_DATA_CONFIRMATION = "CLEAR CUSTOMER DATA";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearConfirmation, setClearConfirmation] = useState("");
  const [clearing, setClearing] = useState(false);

  const loadUsers = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError("");

      try {
        const q = new URLSearchParams();
        if (search) q.set("search", search);
        if (sort) q.set("sort", sort);

        const response = await fetch(`/api/admin/users?${q}`, {
          cache: "no-store",
          signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || data?.message || "Failed to load users");
        }

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setUsers([]);
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [search, sort]
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadUsers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadUsers]);

  async function confirmClearCustomerData() {
    if (clearConfirmation.trim() !== CLEAR_CUSTOMER_DATA_CONFIRMATION) return;

    setClearing(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: clearConfirmation.trim() }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Failed to clear customer data");
      }

      setUsers([]);
      setClearModalOpen(false);
      setClearConfirmation("");
      showToast(
        `Customer data cleared. ${data?.removedUsers ?? 0} users removed, ${data?.updatedOrders ?? 0} orders anonymized.`,
        "success"
      );
      void loadUsers();
    } catch (requestError) {
      showToast(
        requestError instanceof Error ? requestError.message : "Failed to clear customer data",
        "error"
      );
    } finally {
      setClearing(false);
    }
  }

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
        action={
          <button
            type="button"
            onClick={() => setClearModalOpen(true)}
            disabled={loading}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(154,34,34,0.26)] bg-[rgba(154,34,34,0.08)] px-5 text-[10px] uppercase tracking-[0.18em] text-[#9A2222] transition-colors hover:bg-[rgba(154,34,34,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            Clear Customer Data
          </button>
        }
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
            <option value="name">Name A-Z</option>
            <option value="email">Email A-Z</option>
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
                  <th>Intent</th>
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
                        <p className="eyebrow mt-2" style={{ color: "rgba(168,121,53,0.85)" }}>
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
                    <td className="min-w-[180px] text-sm">
                      <span className="inline-flex rounded-full border border-[rgba(168,121,53,0.22)] bg-[rgba(168,121,53,0.08)] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#A87935]">
                        {u.accountIntent || "buyer"}
                      </span>
                      {u.deviceAccountWarning ? (
                        <p className="mt-2 inline-flex items-start gap-1.5 text-[11px] leading-5 text-[#D8A24D]">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {u.deviceAccountWarning}
                        </p>
                      ) : null}
                    </td>
                    <td className="text-center text-white/78">{u.orders}</td>
                    <td className="text-right text-[#A87935]">EGP {u.totalSpent.toLocaleString()}</td>
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

      {clearModalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[rgba(123,103,82,0.18)] bg-[#FFF9EF] p-6 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(154,34,34,0.22)] bg-[rgba(154,34,34,0.08)] text-[#9A2222]">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl font-light text-[#3D3025]">Clear customer data?</h2>
            <p className="mt-3 text-sm leading-7 text-[#5B4E42]">
              This removes customer accounts, keeps admin accounts, and anonymizes customer details inside existing orders. Orders, totals, and product history stay available.
            </p>
            <label className="mt-5 grid gap-2 text-[10px] uppercase tracking-[0.18em] text-[#6F6254]">
              Type {CLEAR_CUSTOMER_DATA_CONFIRMATION}
              <input
                value={clearConfirmation}
                onChange={(event) => setClearConfirmation(event.target.value)}
                className="rounded-2xl border border-[rgba(123,103,82,0.18)] bg-white/65 px-4 py-3 text-sm normal-case tracking-normal text-[#3D3025] outline-none"
                autoFocus
              />
            </label>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setClearModalOpen(false);
                  setClearConfirmation("");
                }}
                className="min-h-[44px] rounded-full border border-[rgba(123,103,82,0.16)] px-5 text-[10px] uppercase tracking-[0.2em] text-[#5B4E42]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClearCustomerData}
                disabled={clearing || clearConfirmation.trim() !== CLEAR_CUSTOMER_DATA_CONFIRMATION}
                className="min-h-[44px] rounded-full border border-[rgba(154,34,34,0.28)] bg-[rgba(154,34,34,0.10)] px-5 text-[10px] uppercase tracking-[0.2em] text-[#9A2222] disabled:opacity-45"
              >
                {clearing ? "Clearing" : "Clear Data"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

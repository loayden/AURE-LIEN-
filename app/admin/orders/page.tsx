"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  size?: string | null;
  color?: string | null;
}

interface Customer {
  accountId?: string | null;
  source?: "account" | "guest";
  totalOrders?: number;
  totalSpent?: number;
  joinedAt?: string;
  lastOrderAt?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  fullAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  newsletter?: boolean;
  shippingMethod?: string;
  shippingCost?: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  customer?: Customer;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const handleExportJson = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export-orders");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "orders-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download orders.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/orders", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || data?.message || "Failed to load orders");
        }

        if (!cancelled) {
          setOrders(Array.isArray(data?.orders) ? data.orders : []);
        }
      } catch (err) {
        if (!cancelled) {
          setOrders([]);
          setError(err instanceof Error ? err.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  const formatSource = (customer?: Customer) => {
    return customer?.source === "account" ? "Account" : "Guest";
  };

  const resolveCustomerReference = (order: Order) => {
    if (order.customer?.accountId) return order.customer.accountId;
    if (order.customer?.email) return order.customer.email;
    return order.userId || "guest";
  };

  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalPrice ?? 0), 0);

  return (
    <div className="space-y-8">
      <Link
        href="/admin"
        className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 text-[11px] tracking-wide text-brass transition-colors hover:text-brass/80 sm:text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brass/30 pb-4">
        <div>
          <h1 className="text-xl font-serif font-light tracking-luxury-wide sm:text-2xl">
            All Orders
          </h1>
          <p className="text-ivory-muted text-sm mt-1">
            Every order (with or without an account)
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportJson}
          disabled={exporting || orders.length === 0}
          className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg border border-brass/30 px-4 py-2 text-[11px] tracking-wide text-brass transition-colors hover:bg-brass/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting…" : "Download all orders (JSON)"}
        </button>
      </div>

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-brass/20 bg-charcoal-light/30">
            <p className="text-ivory-muted text-xs uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-xl font-serif font-light text-brass">{orders.length}</p>
          </div>
          <div className="p-4 rounded-xl border border-brass/20 bg-charcoal-light/30">
            <p className="text-ivory-muted text-xs uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-xl font-serif font-light text-brass">EGP {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-ivory-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-brass/20 bg-charcoal-light/30 p-12 text-center text-ivory-muted">
          No orders found
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-brass/20 bg-charcoal-light/30 p-6 shadow-lg"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <p className="text-ivory-muted text-sm">{formatDate(order.createdAt)}</p>
                  <p className="text-brass font-light mt-1">
                    Order <span className="text-ivory font-mono">#{order._id.slice(0, 8)}</span>
                    {" · "}
                    Status: <span className="text-ivory">{order.status}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ivory-muted">
                    <span className="rounded-full border border-brass/20 px-2.5 py-1 text-brass/90">
                      {formatSource(order.customer)}
                    </span>
                    <span className="truncate">Ref: {resolveCustomerReference(order)}</span>
                  </div>
                </div>
                <p className="text-brass text-lg font-light">
                  EGP {Number(order.totalPrice).toLocaleString()}
                </p>
              </div>

              {order.customer && (
                <div className="mb-6 p-4 rounded-lg bg-charcoal/50 border border-brass/10">
                  <h3 className="text-brass text-sm font-medium mb-3 uppercase tracking-wide">Customer & delivery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="text-ivory-muted">Profile:</span> {formatSource(order.customer)}
                    </p>
                    {order.customer.accountId && (
                      <p>
                        <span className="text-ivory-muted">Account ID:</span> {order.customer.accountId}
                      </p>
                    )}
                    {order.customer.totalOrders != null && (
                      <p>
                        <span className="text-ivory-muted">Customer orders:</span> {order.customer.totalOrders}
                      </p>
                    )}
                    {order.customer.totalSpent != null && (
                      <p>
                        <span className="text-ivory-muted">Lifetime spend:</span> EGP {Number(order.customer.totalSpent).toLocaleString()}
                      </p>
                    )}
                    {order.customer.joinedAt && (
                      <p>
                        <span className="text-ivory-muted">First seen:</span> {formatDate(order.customer.joinedAt)}
                      </p>
                    )}
                    {order.customer.email != null && order.customer.email !== "" && (
                      <p><span className="text-ivory-muted">Email:</span> {order.customer.email}</p>
                    )}
                    {order.customer.phone != null && order.customer.phone !== "" && (
                      <p><span className="text-ivory-muted">Phone:</span> {order.customer.phone}</p>
                    )}
                    <p><span className="text-ivory-muted">Name:</span> {order.customer.name || `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "—"}</p>
                    {((order.customer.fullAddress ?? "") !== "" || (order.customer.address ?? "") !== "" || (order.customer.apartment ?? "") !== "") && (
                      <p><span className="text-ivory-muted">Address:</span> {order.customer.fullAddress || [order.customer.address, order.customer.apartment].filter(Boolean).join(", ") || "—"}</p>
                    )}
                    {order.customer.city != null && order.customer.city !== "" && (
                      <p><span className="text-ivory-muted">City:</span> {order.customer.city}</p>
                    )}
                    {order.customer.country != null && order.customer.country !== "" && (
                      <p><span className="text-ivory-muted">Country:</span> {order.customer.country}</p>
                    )}
                    {order.customer.postalCode != null && order.customer.postalCode !== "" && (
                      <p><span className="text-ivory-muted">Postal:</span> {order.customer.postalCode}</p>
                    )}
                    {((order.customer.shippingMethod ?? "") !== "" || order.customer.shippingCost != null) && (
                      <p><span className="text-ivory-muted">Shipping:</span> {order.customer.shippingMethod || "—"}{order.customer.shippingCost != null ? ` · EGP ${order.customer.shippingCost}` : ""}</p>
                    )}
                    {order.customer.newsletter && (
                      <p><span className="text-ivory-muted">Newsletter:</span> Yes</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-brass text-sm font-medium uppercase tracking-wide">Items</h3>
                {(order.items && order.items.length > 0) ? order.items.map((item, i) => (
                  <div
                    key={`${order._id}-${i}`}
                    className="flex items-center gap-4 py-3 border-t border-brass/10 first:border-t-0"
                  >
                    <img
                      src={item.image || "/images/placeholder.svg"}
                      alt={item.name || "Item"}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory">{item.name || "Unknown"}</p>
                      <p className="text-ivory-muted text-sm">
                        Qty: {item.quantity ?? 1}
                        {(item.size ?? item.color) && (
                          <> · {item.size && <>Size {item.size}</>}{item.size && item.color && " · "}{item.color && <>Color {item.color}</>}</>
                        )}
                      </p>
                    </div>
                    <p className="text-brass flex-shrink-0">EGP {((Number(item.price) || 0) * (item.quantity ?? 1)).toLocaleString()}</p>
                  </div>
                )) : (
                  <p className="text-ivory-muted text-sm py-2">No items</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

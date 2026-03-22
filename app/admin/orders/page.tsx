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
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  address?: string;
  apartment?: string;
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
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.orders) setOrders(d.orders);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  const totalRevenue = orders.reduce((s, o) => s + Number(o.totalPrice ?? 0), 0);

  return (
    <div className="space-y-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-brass hover:text-brass/80 transition-colors text-sm tracking-wide"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brass/30 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-light tracking-luxury-wide">
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brass/30 text-brass hover:bg-brass/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide transition-colors"
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
                  <p className="text-ivory-muted text-xs mt-1">User ID: {order.userId}</p>
                </div>
                <p className="text-brass text-lg font-light">
                  EGP {Number(order.totalPrice).toLocaleString()}
                </p>
              </div>

              {order.customer && (
                <div className="mb-6 p-4 rounded-lg bg-charcoal/50 border border-brass/10">
                  <h3 className="text-brass text-sm font-medium mb-3 uppercase tracking-wide">Customer & delivery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {order.customer.email != null && order.customer.email !== "" && (
                      <p><span className="text-ivory-muted">Email:</span> {order.customer.email}</p>
                    )}
                    {order.customer.phone != null && order.customer.phone !== "" && (
                      <p><span className="text-ivory-muted">Phone:</span> {order.customer.phone}</p>
                    )}
                    <p><span className="text-ivory-muted">Name:</span> {order.customer.name || `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "—"}</p>
                    {((order.customer.address ?? "") !== "" || (order.customer.apartment ?? "") !== "") && (
                      <p><span className="text-ivory-muted">Address:</span> {[order.customer.address, order.customer.apartment].filter(Boolean).join(", ") || "—"}</p>
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

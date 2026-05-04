"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, ShoppingBag } from "lucide-react";

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
    setError("");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download orders.");
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
        className="btn-ghost inline-flex"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

      <AdminPageHeader
        title="All Orders"
        description="Every transaction, whether it came from a registered account or a guest checkout."
        action={
          <button
            type="button"
            onClick={handleExportJson}
            disabled={exporting || orders.length === 0}
            className="btn-gold disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting" : "Download Orders"}
          </button>
        }
      />

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Total Orders</p>
            <p className="font-light text-[#A87935]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem" }}>{orders.length}</p>
          </div>
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Total Revenue</p>
            <p className="font-light text-[#A87935]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem" }}>EGP {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {error ? <AdminBanner message={error} /> : null}

      {loading ? (
        <p className="eyebrow">Loading Orders</p>
      ) : orders.length === 0 ? (
        <AdminPanel className="p-6 sm:p-8">
          <AdminEmptyState
            title="No Orders Yet"
            description="Completed and pending order records will be listed here once transactions begin moving through the store."
            icon={ShoppingBag}
          />
        </AdminPanel>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <AdminPanel key={order._id} className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <p className="body-copy">{formatDate(order.createdAt)}</p>
                  <p className="body-copy body-copy-strong mt-2">
                    Order <span className="text-white/84 font-mono">#{order._id.slice(0, 8)}</span>
                    {" · "}
                    Status: <span className="text-white/84">{order.status}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="admin-chip admin-chip-gold">
                      {formatSource(order.customer)}
                    </span>
                    <span className="admin-chip truncate">Ref: {resolveCustomerReference(order)}</span>
                  </div>
                </div>
                <p className="font-light text-[#A87935]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
                  EGP {Number(order.totalPrice).toLocaleString()}
                </p>
              </div>

              {order.customer && (
                <div className="mb-6 rounded-[1.15rem] border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="eyebrow mb-4" style={{ color: "rgba(168,121,53,0.85)" }}>Customer & Delivery</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <p className="body-copy">
                      <span className="text-white/20">Profile:</span> {formatSource(order.customer)}
                    </p>
                    {order.customer.accountId && (
                      <p className="body-copy">
                        <span className="text-white/20">Account ID:</span> {order.customer.accountId}
                      </p>
                    )}
                    {order.customer.totalOrders != null && (
                      <p className="body-copy">
                        <span className="text-white/20">Customer orders:</span> {order.customer.totalOrders}
                      </p>
                    )}
                    {order.customer.totalSpent != null && (
                      <p className="body-copy">
                        <span className="text-white/20">Lifetime spend:</span> EGP {Number(order.customer.totalSpent).toLocaleString()}
                      </p>
                    )}
                    {order.customer.joinedAt && (
                      <p className="body-copy">
                        <span className="text-white/20">First seen:</span> {formatDate(order.customer.joinedAt)}
                      </p>
                    )}
                    {order.customer.email != null && order.customer.email !== "" && (
                      <p className="body-copy"><span className="text-white/20">Email:</span> {order.customer.email}</p>
                    )}
                    {order.customer.phone != null && order.customer.phone !== "" && (
                      <p className="body-copy"><span className="text-white/20">Phone:</span> {order.customer.phone}</p>
                    )}
                    <p className="body-copy"><span className="text-white/20">Name:</span> {order.customer.name || `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "—"}</p>
                    {((order.customer.fullAddress ?? "") !== "" || (order.customer.address ?? "") !== "" || (order.customer.apartment ?? "") !== "") && (
                      <p className="body-copy"><span className="text-white/20">Address:</span> {order.customer.fullAddress || [order.customer.address, order.customer.apartment].filter(Boolean).join(", ") || "—"}</p>
                    )}
                    {order.customer.city != null && order.customer.city !== "" && (
                      <p className="body-copy"><span className="text-white/20">City:</span> {order.customer.city}</p>
                    )}
                    {order.customer.country != null && order.customer.country !== "" && (
                      <p className="body-copy"><span className="text-white/20">Country:</span> {order.customer.country}</p>
                    )}
                    {order.customer.postalCode != null && order.customer.postalCode !== "" && (
                      <p className="body-copy"><span className="text-white/20">Postal:</span> {order.customer.postalCode}</p>
                    )}
                    {((order.customer.shippingMethod ?? "") !== "" || order.customer.shippingCost != null) && (
                      <p className="body-copy"><span className="text-white/20">Shipping:</span> {order.customer.shippingMethod || "—"}{order.customer.shippingCost != null ? ` · EGP ${order.customer.shippingCost}` : ""}</p>
                    )}
                    {order.customer.newsletter && (
                      <p className="body-copy"><span className="text-white/20">Newsletter:</span> Yes</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="eyebrow" style={{ color: "rgba(168,121,53,0.85)" }}>Items</h3>
                {(order.items && order.items.length > 0) ? order.items.map((item, i) => (
                  <div
                    key={`${order._id}-${i}`}
                    className="flex items-center gap-4 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[0.9rem]">
                      <Image
                        src={item.image || "/images/placeholder.svg"}
                        alt={item.name || "Item"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="body-copy body-copy-strong">{item.name || "Unknown"}</p>
                      <p className="body-copy text-sm">
                        Qty: {item.quantity ?? 1}
                        {(item.size ?? item.color) && (
                          <> · {item.size && <>Size {item.size}</>}{item.size && item.color && " · "}{item.color && <>Color {item.color}</>}</>
                        )}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-[#A87935]">EGP {((Number(item.price) || 0) * (item.quantity ?? 1)).toLocaleString()}</p>
                  </div>
                )) : (
                  <p className="body-copy py-2">No items</p>
                )}
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}

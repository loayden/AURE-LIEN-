"use client";

import AdminBanner from "@/components/admin/AdminBanner";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Receipt } from "lucide-react";

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  orders?: number;
  totalSpent?: number;
  source?: "account" | "guest";
  createdAt?: string;
  lastOrderAt?: string;
}

export default function AdminUserOrdersPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadUserOrders() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/admin/users/${userId}/orders`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || data?.message || "Failed to load user orders");
        }

        if (!cancelled) {
          setUser(data.user || null);
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          setOrders([]);
          setError(err instanceof Error ? err.message : "Failed to load user orders");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUserOrders();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  return (
    <div className="space-y-8">
      <Link
        href="/admin/users"
        className="btn-ghost inline-flex"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      <AdminPageHeader
        title={user ? `${user.name} Orders` : "Client Orders"}
        description={user ? `Order history for ${user.email || "this client profile"}.` : "Loading client history."}
      />

      {error ? <AdminBanner message={error} /> : null}

      {user && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Profile</p>
            <p className="body-copy body-copy-strong">{user.source === "account" ? "Registered account" : "Guest checkout"}</p>
          </div>
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Phone</p>
            <p className="body-copy body-copy-strong">{user.phone || "-"}</p>
          </div>
          <div className="admin-stat-card p-4 sm:col-span-2">
            <p className="eyebrow mb-3">Address</p>
            <p className="body-copy body-copy-strong">{user.address || "-"}</p>
          </div>
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Orders</p>
            <p className="font-light text-[#C6A962]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem" }}>{user.orders ?? orders.length}</p>
          </div>
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Total Spent</p>
            <p className="font-light text-[#C6A962]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem" }}>EGP {Number(user.totalSpent ?? totalSpent).toLocaleString()}</p>
          </div>
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Location</p>
            <p className="body-copy body-copy-strong">
              {[user.city, user.postalCode, user.country].filter(Boolean).join(", ") || "-"}
            </p>
          </div>
          <div className="admin-stat-card p-4">
            <p className="eyebrow mb-3">Last Activity</p>
            <p className="body-copy body-copy-strong">{formatDate(user.lastOrderAt || user.createdAt || "")}</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="eyebrow">Loading Order History</p>
      ) : orders.length === 0 ? (
        <AdminPanel className="p-6 sm:p-8">
          <AdminEmptyState
            title="No Orders Found"
            description="Once this client completes a purchase, their history will appear here inside the shared admin shell."
            icon={Receipt}
          />
        </AdminPanel>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <AdminPanel key={order._id} className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <p className="body-copy">{formatDate(order.createdAt)}</p>
                  <p className="body-copy body-copy-strong mt-2">
                    Status: <span className="text-white/84">{order.status}</span>
                  </p>
                </div>
                <p className="font-light text-[#C6A962]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem" }}>
                  EGP {Number(order.totalPrice).toLocaleString()}
                </p>
              </div>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={`${order._id}-${i}`}
                    className="flex items-center gap-4 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    {item.image && (
                      <div className="relative h-14 w-14 overflow-hidden rounded-[0.9rem]">
                        <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="body-copy body-copy-strong">{item.name}</p>
                      <p className="body-copy text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#C6A962]">EGP {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </div>
  );
}

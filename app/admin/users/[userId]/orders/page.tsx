"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
}

export default function AdminUserOrdersPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/admin/users/${userId}/orders`)
        .then((r) => r.json())
        .then((d) => {
          setUser(d.user);
          setOrders(d.orders || []);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
  }, [userId]);

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-brass hover:text-brass/80 transition-colors text-sm tracking-wide"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Link>

      <h1 className="text-2xl font-serif font-light tracking-luxury-wide border-b border-brass/30 pb-4">
        Orders — {user ? `${user.name} (${user.email})` : "Loading..."}
      </h1>

      {loading ? (
        <p className="text-ivory-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-brass/20 bg-charcoal-light/30 p-12 text-center text-ivory-muted">
          No orders found for this user
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-brass/20 bg-charcoal-light/30 p-6 shadow-lg"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <p className="text-ivory-muted text-sm">{formatDate(order.createdAt)}</p>
                  <p className="text-brass font-light mt-1">
                    Status: <span className="text-ivory">{order.status}</span>
                  </p>
                </div>
                <p className="text-brass text-lg font-light">
                  EGP {Number(order.totalPrice).toLocaleString()}
                </p>
              </div>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={`${order._id}-${i}`}
                    className="flex items-center gap-4 py-3 border-t border-brass/10 first:border-t-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-ivory">{item.name}</p>
                      <p className="text-ivory-muted text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-brass">EGP {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

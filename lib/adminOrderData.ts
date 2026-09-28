import { getOrdersJson } from "@/lib/orderStorage";

export type AdminOrderRecord = {
  _id: string;
  id: string;
  userId: string;
  items: Array<{
    productId: string | null;
    _id?: string;
    name: string;
    price: number;
    quantity: number;
    size?: string | null;
    color?: string | null;
    image?: string | null;
  }>;
  products?: Array<{
    _id: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
    size?: string | null;
    color?: string | null;
  }>;
  total: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  customer?: {
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
  };
};

export async function getAllAdminOrders(): Promise<AdminOrderRecord[]> {
  const legacyOrders = (await getOrdersJson()) as AdminOrderRecord[];

  const merged = new Map<string, AdminOrderRecord>();
  for (const order of legacyOrders) {
    const id = String(order._id ?? order.id ?? "");
    if (id) merged.set(id, order);
  }

  return Array.from(merged.values());
}

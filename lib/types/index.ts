/**
 * Central type definitions for AURELIA Luxury Ecommerce
 */

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  images: string[];
  size: string[];
  colors: string[];
  description?: string;
  material?: string;
  stock?: number;
  /** 360° spin images or extra angles */
  media360?: string[];
  /** Product video URL */
  videoUrl?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  _id?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

export interface Order {
  id?: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  status: string;
  customer?: Customer;
  createdAt?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CategoryCard {
  title: string;
  image: string;
  link: string;
}

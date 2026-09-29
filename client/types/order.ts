import { Address } from './user';
import { Product } from './product';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderItem {
  _id?: string;
  product: Product | string;
  seller: string;
  title: string;
  image?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  status: OrderStatus;
  deliveredAt?: string;
}

export interface TrackingUpdate {
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  total: number;
  savings: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  payment: {
    method: 'cod';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    gateway: 'cod';
    paidAt?: string;
  };
  pricing: OrderPricing;
  tracking: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    updates: TrackingUpdate[];
  };
  estimatedDelivery: string;
  deliveredAt?: string;
  notes?: string;
  isGift?: boolean;
  giftMessage?: string;
  status: OrderStatus;
  isPrimeOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

import { Product } from './product';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  variant?: {
    name: string;
    value: string;
    sku?: string;
  };
  addedAt: string;
}

export interface SavedForLaterItem {
  _id: string;
  product: Product;
  variant?: {
    name: string;
    value: string;
  };
  savedAt: string;
  priceWhenSaved?: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  savings: number;
  couponDiscount: number;
}

export interface CartState {
  items: CartItem[];
  savedForLater: SavedForLaterItem[];
  summary: CartSummary;
  couponApplied?: {
    code: string;
    discount: number;
    type: string;
  };
  isLoading: boolean;
  error: string | null;
}

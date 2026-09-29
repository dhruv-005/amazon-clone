import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, SavedForLaterItem, CartSummary } from '@/types/cart';
import { Product } from '@/types/product';

interface CartState {
  items: CartItem[];
  savedForLater: SavedForLaterItem[];
  summary: CartSummary;
  couponApplied?: {
    code: string;
    discount: number;
    type: string;
  };
}

const calculateSummary = (items: CartItem[], couponDiscount = 0): CartSummary => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price?.current || 0) * item.quantity,
    0
  );
  const originalTotal = items.reduce(
    (sum, item) => sum + (item.product?.price?.original || item.product?.price?.current || 0) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal + couponDiscount;

  return {
    totalItems,
    subtotal,
    savings: Math.max(0, savings),
    couponDiscount,
  };
};

const initialState: CartState = {
  items: [],
  savedForLater: [],
  summary: {
    totalItems: 0,
    subtotal: 0,
    savings: 0,
    couponDiscount: 0,
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartState: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        savedForLater?: SavedForLaterItem[];
        couponApplied?: { code: string; discount: number; type: string };
      }>
    ) => {
      state.items = action.payload.items || [];
      state.savedForLater = action.payload.savedForLater || [];
      state.couponApplied = action.payload.couponApplied;
      state.summary = calculateSummary(state.items, state.couponApplied?.discount || 0);

      if (typeof window !== 'undefined') {
        localStorage.setItem('amazon_cart', JSON.stringify(state.items));
      }
    },
    addItemLocal: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number; variant?: any }>
    ) => {
      const { product, quantity = 1, variant } = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock || 10, 10);
      } else {
        state.items.push({
          _id: `temp_${Date.now()}`,
          product,
          quantity,
          variant,
          addedAt: new Date().toISOString(),
        });
      }

      state.summary = calculateSummary(state.items, state.couponApplied?.discount || 0);

      if (typeof window !== 'undefined') {
        localStorage.setItem('amazon_cart', JSON.stringify(state.items));
      }
    },
    updateQuantityLocal: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i._id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.summary = calculateSummary(state.items, state.couponApplied?.discount || 0);
        if (typeof window !== 'undefined') {
          localStorage.setItem('amazon_cart', JSON.stringify(state.items));
        }
      }
    },
    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      state.summary = calculateSummary(state.items, state.couponApplied?.discount || 0);

      if (typeof window !== 'undefined') {
        localStorage.setItem('amazon_cart', JSON.stringify(state.items));
      }
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.couponApplied = undefined;
      state.summary = { totalItems: 0, subtotal: 0, savings: 0, couponDiscount: 0 };
      if (typeof window !== 'undefined') {
        localStorage.removeItem('amazon_cart');
      }
    },
    restoreLocalCart: (state) => {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('amazon_cart');
        if (local) {
          try {
            state.items = JSON.parse(local);
            state.summary = calculateSummary(state.items, 0);
          } catch {
            localStorage.removeItem('amazon_cart');
          }
        }
      }
    },
  },
});

export const {
  setCartState,
  addItemLocal,
  updateQuantityLocal,
  removeItemLocal,
  clearCartLocal,
  restoreLocalCart,
} = cartSlice.actions;

export default cartSlice.reducer;

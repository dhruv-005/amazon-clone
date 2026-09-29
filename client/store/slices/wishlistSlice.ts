import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';

interface WishlistState {
  items: Array<{
    _id: string;
    product: Product;
    addedAt: string;
  }>;
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistState['items']>) => {
      state.items = action.payload || [];
    },
    addWishlistLocal: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((i) => i.product._id === action.payload._id);
      if (!exists) {
        state.items.push({
          _id: `temp_${Date.now()}`,
          product: action.payload,
          addedAt: new Date().toISOString(),
        });
      }
    },
    removeWishlistLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
    },
  },
});

export const { setWishlist, addWishlistLocal, removeWishlistLocal } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

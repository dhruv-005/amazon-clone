import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';

interface ProductState {
  selectedProduct: Product | null;
  recentlyViewed: Product[];
}

const initialState: ProductState = {
  selectedProduct: null,
  recentlyViewed: [],
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    addRecentlyViewed: (state, action: PayloadAction<Product>) => {
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter((p) => p._id !== action.payload._id),
      ].slice(0, 10);
    },
  },
});

export const { setSelectedProduct, addRecentlyViewed } = productSlice.actions;
export default productSlice.reducer;

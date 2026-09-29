import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types/order';

interface OrderState {
  recentOrder: Order | null;
}

const initialState: OrderState = {
  recentOrder: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setRecentOrder: (state, action: PayloadAction<Order | null>) => {
      state.recentOrder = action.payload;
    },
  },
});

export const { setRecentOrder } = orderSlice.actions;
export default orderSlice.reducer;

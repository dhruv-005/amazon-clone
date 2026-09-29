import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '@/types/user';

interface CheckoutState {
  selectedAddress: Address | null;
  paymentMethod: 'cod';
  orderNotes?: string;
  isGift: boolean;
  giftMessage?: string;
  currentStep: number; // 1: Address, 2: Payment, 3: Review
}

const initialState: CheckoutState = {
  selectedAddress: null,
  paymentMethod: 'cod',
  isGift: false,
  currentStep: 1,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
    },
    setOrderNotes: (state, action: PayloadAction<string>) => {
      state.orderNotes = action.payload;
    },
    setGiftOptions: (
      state,
      action: PayloadAction<{ isGift: boolean; giftMessage?: string }>
    ) => {
      state.isGift = action.payload.isGift;
      state.giftMessage = action.payload.giftMessage;
    },
    setCheckoutStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setSelectedAddress,
  setOrderNotes,
  setGiftOptions,
  setCheckoutStep,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

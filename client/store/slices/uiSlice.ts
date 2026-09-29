import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMegaMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  deliveryLocationModalOpen: boolean;
  currentLanguage: string;
}

const initialState: UIState = {
  isMegaMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchModalOpen: false,
  deliveryLocationModalOpen: false,
  currentLanguage: 'en',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMegaMenu: (state, action: PayloadAction<boolean | undefined>) => {
      state.isMegaMenuOpen =
        action.payload !== undefined ? action.payload : !state.isMegaMenuOpen;
    },
    toggleCartDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.isCartDrawerOpen =
        action.payload !== undefined ? action.payload : !state.isCartDrawerOpen;
    },
    toggleLocationModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.deliveryLocationModalOpen =
        action.payload !== undefined
          ? action.payload
          : !state.deliveryLocationModalOpen;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const {
  toggleMegaMenu,
  toggleCartDrawer,
  toggleLocationModal,
  setLanguage,
} = uiSlice.actions;
export default uiSlice.reducer;

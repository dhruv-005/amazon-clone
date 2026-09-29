import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/productSlice';
import uiReducer from './slices/uiSlice';
import checkoutReducer from './slices/checkoutSlice';
import notificationReducer from './slices/notificationSlice';
import searchReducer from './slices/searchSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  product: productReducer,
  ui: uiReducer,
  checkout: checkoutReducer,
  notification: notificationReducer,
  search: searchReducer,
  order: orderReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

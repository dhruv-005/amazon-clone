'use client';

import React, { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { restoreUserSession } from './slices/authSlice';
import { restoreLocalCart } from './slices/cartSlice';

interface StoreProviderProps {
  children: ReactNode;
}

function StoreInitializer({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Restore session and cart from localStorage upon browser mount
    store.dispatch(restoreUserSession());
    store.dispatch(restoreLocalCart());
  }, []);

  return <>{children}</>;
}

export function ReduxProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
}

export default ReduxProvider;

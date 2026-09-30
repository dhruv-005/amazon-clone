'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { restoreUserSession } from './slices/authSlice';
import { restoreLocalCart } from './slices/cartSlice';
import ChatWidget from '@/components/common/ChatWidget';
import ScrollToTop from '@/components/common/ScrollToTop';

export function ReduxProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    store.dispatch(restoreUserSession());
    store.dispatch(restoreLocalCart());
  }, []);

  return (
    <Provider store={store}>
      {children}
      {mounted && (
        <>
          <ChatWidget />
          <ScrollToTop />
        </>
      )}
    </Provider>
  );
}

export default ReduxProvider;

'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export const CartIcon: React.FC = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="flex items-end px-2 py-1 border border-transparent hover:border-white rounded-sm transition-colors relative"
      aria-label={`Shopping cart with ${totalCount} items`}
    >
      <div className="relative flex items-center">
        {/* Dynamic Quantity Badge on Cart */}
        <span className="absolute -top-1 left-[13px] text-[#f08804] font-bold text-xs sm:text-sm text-center min-w-[16px]">
          {totalCount > 99 ? '99+' : totalCount}
        </span>

        {/* Amazon Signature Cart SVG */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current text-white"
          viewBox="0 0 24 24"
        >
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </div>

      <span className="hidden sm:inline text-xs font-bold text-white mb-0.5 ml-0.5">
        Cart
      </span>
    </Link>
  );
};

export default CartIcon;

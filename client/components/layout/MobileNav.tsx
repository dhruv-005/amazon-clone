'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMegaMenu } from '@/store/slices/uiSlice';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-40 flex items-center justify-around text-gray-700 shadow-lg">
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-full h-full ${
          pathname === '/' ? 'text-orange-600 font-bold' : 'hover:text-gray-900'
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="text-[10px] mt-0.5">Home</span>
      </Link>

      {/* Account */}
      <Link
        href="/account"
        className={`flex flex-col items-center justify-center w-full h-full ${
          pathname.startsWith('/account') ? 'text-orange-600 font-bold' : 'hover:text-gray-900'
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span className="text-[10px] mt-0.5">Account</span>
      </Link>

      {/* Cart */}
      <Link
        href="/cart"
        className={`flex flex-col items-center justify-center w-full h-full relative ${
          pathname === '/cart' ? 'text-orange-600 font-bold' : 'hover:text-gray-900'
        }`}
      >
        <div className="relative">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-500 text-white font-bold text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Cart</span>
      </Link>

      {/* Menu / All */}
      <button
        onClick={() => dispatch(toggleMegaMenu(true))}
        className="flex flex-col items-center justify-center w-full h-full hover:text-gray-900"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
        <span className="text-[10px] mt-0.5">Menu</span>
      </button>
    </div>
  );
};

export default MobileNav;

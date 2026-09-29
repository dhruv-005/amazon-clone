'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';

export const EmptyCart: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
      <div className="relative w-48 h-48 mx-auto mb-4">
        <Image
          src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400"
          alt="Empty Shopping Cart"
          fill
          className="object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Amazon Cart is empty
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
        Check out today's deals, discover personalized recommendations, or continue shopping.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs px-8 py-2.5 rounded-full border border-[#fcd200] shadow-sm transition"
        >
          Explore Today's Deals
        </Link>
        {!user && (
          <Link
            href="/login"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs px-8 py-2.5 rounded-full border border-gray-300 shadow-sm transition"
          >
            Sign in to your account
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyCart;

'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import CartHeader from '@/components/cart/CartHeader';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import SaveForLater from '@/components/cart/SaveForLater';
import CartRecommendations from '@/components/cart/CartRecommendations';
import EmptyCart from '@/components/cart/EmptyCart';

export default function CartPage() {
  const { items, summary } = useAppSelector((state) => state.cart);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyCart />
        <SaveForLater />
        <CartRecommendations />
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-9 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm">
          <CartHeader itemCount={totalCount} />
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Column: Checkout Summary Box */}
        <div className="lg:col-span-3">
          <CartSummary summary={summary} itemCount={totalCount} />
        </div>
      </div>

      {/* Save For Later Section */}
      <SaveForLater />

      {/* Recommendations */}
      <CartRecommendations />
    </div>
  );
}

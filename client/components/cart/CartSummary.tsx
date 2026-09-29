'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartSummary as CartSummaryType } from '@/types/cart';
import Button from '../ui/Button';
import CartCoupon from './CartCoupon';

interface CartSummaryProps {
  summary: CartSummaryType;
  itemCount: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ summary, itemCount }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Main Checkout Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 select-none">
        {/* Free delivery indicator */}
        <div className="flex items-center gap-2 text-xs text-[#007600] font-medium">
          <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>
            Your order is eligible for <strong>FREE Delivery</strong>.
          </span>
        </div>

        {/* Subtotal line */}
        <div>
          <div className="text-base text-gray-900 font-medium">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):{' '}
            <strong className="text-lg sm:text-xl text-gray-900 font-bold">
              ₹{summary.subtotal.toLocaleString('en-IN')}
            </strong>
          </div>
          {summary.savings > 0 && (
            <p className="text-xs text-[#007600] font-bold mt-1">
              You are saving ₹{summary.savings.toLocaleString('en-IN')} on this order!
            </p>
          )}
        </div>

        {/* Gift checkbox */}
        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            className="rounded text-orange-500 focus:ring-orange-400"
          />
          <span>This order contains a gift</span>
        </label>

        {/* Proceed to Checkout Button */}
        <Button
          variant="primary"
          fullWidth
          disabled={itemCount === 0}
          onClick={() => router.push('/checkout')}
          className="py-2.5 text-sm font-semibold shadow-md"
        >
          Proceed to Buy
        </Button>

        <p className="text-[11px] text-gray-500 text-center">
          Payment method: <strong>Cash on Delivery (COD)</strong>
        </p>
      </div>

      {/* Promo Code Card */}
      <CartCoupon />
    </div>
  );
};

export default CartSummary;

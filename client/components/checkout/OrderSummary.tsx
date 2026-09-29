'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';

export const OrderSummary: React.FC = () => {
  const summary = useAppSelector((state) => state.cart.summary);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3 text-xs select-none sticky top-20">
      <h3 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2">
        Order Summary
      </h3>

      <div className="space-y-1.5 text-gray-600">
        <div className="flex justify-between">
          <span>Items ({summary.totalItems}):</span>
          <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span className="text-[#007600] font-semibold">FREE</span>
        </div>
        {summary.couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Coupon Discount:</span>
            <span>-₹{summary.couponDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-[#b12704]">
        <span>Order Total:</span>
        <span>
          ₹{Math.max(0, summary.subtotal - summary.couponDiscount).toLocaleString('en-IN')}
        </span>
      </div>

      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
        Payment via: <strong className="text-gray-800">Cash on Delivery</strong>
      </div>
    </div>
  );
};

export default OrderSummary;

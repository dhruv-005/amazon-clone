'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';

interface OrderConfirmationProps {
  order: Order;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-6 sm:p-10 shadow-sm space-y-6 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
        ✓
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Order placed, thank you!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Confirmation will be sent to your email address.
        </p>
      </div>

      <div className="bg-[#f0f2f2] border border-gray-300 rounded p-4 text-xs sm:text-sm text-gray-800 max-w-md mx-auto text-left space-y-1">
        <p>
          <strong>Order Number:</strong> #{order.orderNumber}
        </p>
        <p>
          <strong>Estimated Delivery:</strong> Tomorrow by 9 PM
        </p>
        <p>
          <strong>Payment Mode:</strong> Cash on Delivery (₹{order.pricing.total.toLocaleString('en-IN')})
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href={`/orders/${order._id}`}
          className="w-full sm:w-auto bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs px-8 py-2.5 rounded-full border border-[#fcd200] shadow-sm transition"
        >
          Track Your Order
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs px-8 py-2.5 rounded-full border border-gray-300 shadow-sm transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

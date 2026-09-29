'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 space-y-6 text-xs text-gray-800">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <h2 className="text-base font-bold text-gray-900">Order Details</h2>
        <span className="text-gray-500">Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900 mb-1">Shipping Address</h4>
          <p className="font-semibold">{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.addressLine1}</p>
          {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
          <p>
            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
          <p>Phone: {order.shippingAddress?.phoneNumber}</p>
        </div>

        {/* Payment Method */}
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900 mb-1">Payment Method</h4>
          <p className="font-semibold">Cash on Delivery (COD)</p>
          <p className="text-gray-500">Status: <span className="capitalize font-bold text-gray-800">{order.payment?.status}</span></p>
        </div>

        {/* Order Summary */}
        <div className="space-y-1.5 bg-gray-50 p-3 rounded border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-1">Order Summary</h4>
          <div className="flex justify-between">
            <span>Item(s) Subtotal:</span>
            <span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{order.pricing?.shipping === 0 ? 'FREE' : `₹${order.pricing?.shipping}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax (GST):</span>
            <span>₹{order.pricing?.tax?.toLocaleString('en-IN')}</span>
          </div>
          {order.pricing?.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Coupon Discount:</span>
              <span>-₹{order.pricing?.couponDiscount?.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-1 flex justify-between font-bold text-sm text-[#b12704]">
            <span>Grand Total:</span>
            <span>₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

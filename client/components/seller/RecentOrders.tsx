'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3 text-xs">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
        <Link href="/seller/orders" className="text-[#007185] hover:underline font-medium">
          View all
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {orders.slice(0, 5).map((o) => (
          <div key={o._id} className="py-2.5 flex justify-between items-center">
            <div>
              <span className="font-bold text-gray-900">#{o.orderNumber}</span>
              <p className="text-[11px] text-gray-500">{o.shippingAddress?.fullName} • {o.items?.length} items</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900">₹{o.pricing?.total?.toLocaleString('en-IN')}</span>
              <span className="block text-[10px] text-emerald-600 font-bold uppercase">{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;

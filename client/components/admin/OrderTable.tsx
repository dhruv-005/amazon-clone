'use client';

import React from 'react';
import { Order } from '@/types/order';
import OrderStatus from '../order/OrderStatus';

interface AdminOrderTableProps {
  orders: Order[];
}

export const OrderTable: React.FC<AdminOrderTableProps> = ({ orders }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700 font-bold">
            <th className="p-3">Order ID</th>
            <th className="p-3">Recipient</th>
            <th className="p-3">Total (COD)</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((o) => (
            <tr key={o._id} className="hover:bg-gray-50">
              <td className="p-3 font-bold text-gray-900">#{o.orderNumber}</td>
              <td className="p-3">{o.shippingAddress?.fullName} ({o.shippingAddress?.city})</td>
              <td className="p-3 font-bold text-[#b12704]">₹{o.pricing?.total?.toLocaleString('en-IN')}</td>
              <td className="p-3"><OrderStatus status={o.status} /></td>
              <td className="p-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

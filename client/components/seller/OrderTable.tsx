'use client';

import React from 'react';
import { Order } from '@/types/order';
import OrderStatus from '../order/OrderStatus';

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onUpdateStatus }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700">
            <th className="p-3">Order Number</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Items</th>
            <th className="p-3">Total Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="p-3 font-bold text-gray-900">#{order.orderNumber}</td>
              <td className="p-3">
                <span className="font-semibold block">{order.shippingAddress?.fullName}</span>
                <span className="text-gray-500 text-[11px]">{order.shippingAddress?.city}</span>
              </td>
              <td className="p-3">{order.items?.length} items</td>
              <td className="p-3 font-bold text-gray-900">
                ₹{order.pricing?.total?.toLocaleString('en-IN')}
              </td>
              <td className="p-3">
                <OrderStatus status={order.status} />
              </td>
              <td className="p-3 text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </td>
              <td className="p-3 text-right">
                {order.status === 'confirmed' && onUpdateStatus && (
                  <button
                    onClick={() => onUpdateStatus(order._id, 'shipped')}
                    className="bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold px-3 py-1 rounded shadow-sm"
                  >
                    Mark Dispatched
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

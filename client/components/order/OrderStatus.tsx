'use client';

import React from 'react';
import { OrderStatus as StatusType } from '@/types/order';

interface OrderStatusProps {
  status: StatusType;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const statusConfig: Record<StatusType, { label: string; style: string }> = {
    placed: { label: 'Order Placed', style: 'bg-blue-100 text-blue-800 border-blue-300' },
    confirmed: { label: 'Confirmed', style: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    processing: { label: 'Processing', style: 'bg-amber-100 text-amber-800 border-amber-300' },
    shipped: { label: 'Dispatched', style: 'bg-purple-100 text-purple-800 border-purple-300' },
    out_for_delivery: { label: 'Out for Delivery', style: 'bg-orange-100 text-orange-800 border-orange-300' },
    delivered: { label: 'Delivered', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    cancelled: { label: 'Cancelled', style: 'bg-red-100 text-red-800 border-red-300' },
    returned: { label: 'Returned', style: 'bg-gray-100 text-gray-800 border-gray-300' },
    refunded: { label: 'Refunded', style: 'bg-teal-100 text-teal-800 border-teal-300' },
  };

  const current = statusConfig[status] || { label: status, style: 'bg-gray-100 text-gray-800 border-gray-300' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${current.style}`}>
      {current.label}
    </span>
  );
};

export default OrderStatus;

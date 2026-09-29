'use client';

import React from 'react';
import Link from 'next/link';
import { useGetOrdersQuery } from '@/store/api/orderApi';
import OrderCard from '@/components/order/OrderCard';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function OrdersPage() {
  const { data, isLoading } = useGetOrdersQuery({});
  const orders = data?.data?.orders || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <Breadcrumb items={[{ label: 'Your Account', href: '/account' }, { label: 'Your Orders' }]} />

      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <span className="text-xs text-gray-500 font-medium">
          {orders.length} orders placed
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded border border-gray-200 space-y-3">
          <h3 className="font-bold text-lg text-gray-800">You have no orders yet</h3>
          <p className="text-xs text-gray-500">Discover millions of products on Amazon Clone.</p>
          <Link
            href="/"
            className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs px-6 py-2 rounded-full border border-[#fcd200]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

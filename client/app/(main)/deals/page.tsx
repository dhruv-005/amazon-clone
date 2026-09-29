'use client';

import React from 'react';
import { useGetDealProductsQuery } from '@/store/api/productApi';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function DealsPage() {
  const { data, isLoading } = useGetDealProductsQuery();
  const products = data?.data?.products || [];

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-4">
      <Breadcrumb items={[{ label: "Today's Deals" }]} />

      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 rounded shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black">Today's Lightning Deals</h1>
        <p className="text-xs text-red-100 mt-1">
          Deals refreshed every hour. Grab limited-time prices before quantities run out!
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

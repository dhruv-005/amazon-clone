'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchProductsQuery } from '@/store/api/searchApi';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;

  const { data, isLoading } = useSearchProductsQuery({ q: query, category });
  const products = data?.data?.products || [];

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-4">
      <Breadcrumb items={[{ label: `Search: "${query}"` }]} />

      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm text-xs">
        <span className="text-gray-600">
          Showing results for <strong className="text-gray-900 text-sm">"{query}"</strong>
        </span>
      </div>

      <ProductGrid products={products} isLoading={isLoading} viewMode="list" />
    </div>
  );
}

'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/store/api/productApi';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: catData } = useGetCategoriesQuery();
  const category = catData?.data?.categories?.find((c) => c.slug === slug);

  const { data, isLoading } = useGetProductsQuery({
    category: category?._id,
    limit: 20,
  });
  const products = data?.data?.products || [];

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-4">
      <Breadcrumb items={[{ label: category?.name || slug }]} />

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{category?.name || slug}</h1>
        {category?.description && (
          <p className="text-xs text-gray-500 mt-1">{category.description}</p>
        )}
      </div>

      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}

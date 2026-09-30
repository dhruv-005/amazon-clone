'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetProductsQuery } from '@/store/api/productApi';

export default function TrendingProducts() {
  const { data } = useGetProductsQuery({ sort: 'popular', limit: 8 });
  const products = data?.data?.products || [];

  if (products.length === 0) return null;

  return (
    <div className="max-w-[1500px] mx-auto px-4 my-6">
      <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Bestsellers in Electronics & Lifestyle</h2>
          <Link href="/products?sort=popular" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium">
            See more
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {products.map((product, idx) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="flex flex-col items-center text-center p-2 rounded hover:shadow-md border border-transparent hover:border-gray-200 transition group"
            >
              <span className="text-[10px] font-bold text-gray-400 self-start">#{idx + 1}</span>
              <div className="relative h-28 w-28 mb-2">
                <Image
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  sizes="112px"
                />
              </div>
              <h3 className="text-xs text-gray-800 line-clamp-2 group-hover:text-orange-600 font-medium">
                {product.title}
              </h3>
              <p className="text-xs font-bold text-[#b12704] mt-1">
                ₹{product.price?.current?.toLocaleString('en-IN')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

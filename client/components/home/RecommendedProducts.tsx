'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetFeaturedProductsQuery } from '@/store/api/productApi';
import Rating from '@/components/ui/Rating';

export default function RecommendedProducts() {
  const { data, isLoading } = useGetFeaturedProductsQuery();
  const products = data?.data?.products || [];

  if (isLoading || products.length === 0) return null;

  return (
    <div className="max-w-[1500px] mx-auto px-4 my-6">
      <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="group flex flex-col justify-between p-2 rounded hover:shadow-md border border-transparent hover:border-gray-200 transition bg-white"
            >
              <div className="relative h-40 w-full mb-2 bg-white flex items-center justify-center">
                <Image
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xs text-gray-800 line-clamp-2 group-hover:text-orange-600 font-medium">
                  {product.title}
                </h3>
                <Rating value={product.ratings?.average || 0} count={product.ratings?.count || 0} size="sm" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{product.price?.current?.toLocaleString('en-IN')}
                  </span>
                  {product.price?.discount > 0 && (
                    <span className="text-[10px] text-gray-500 line-through">
                      ₹{product.price?.original?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {product.shipping?.isFreeShipping && (
                  <p className="text-[10px] text-gray-600">
                    <span className="font-bold text-gray-900">FREE Delivery</span> by Amazon
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

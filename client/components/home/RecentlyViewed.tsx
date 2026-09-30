'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';

export default function RecentlyViewed() {
  const recentlyViewed = useAppSelector((state) => state.product.recentlyViewed);

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="max-w-[1500px] mx-auto px-4 my-6">
      <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Related to items you've viewed</h2>
          <Link href="/account" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline">
            View or edit your browsing history
          </Link>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
          {recentlyViewed.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="flex-shrink-0 w-36 sm:w-44 p-2 rounded hover:shadow border border-transparent hover:border-gray-200 transition flex flex-col"
            >
              <div className="relative h-36 w-full bg-white flex items-center justify-center mb-2">
                <Image
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-contain p-2"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs text-gray-800 truncate font-medium">{product.title}</h3>
              <p className="text-xs font-bold text-gray-900 mt-1">
                ₹{product.price?.current?.toLocaleString('en-IN')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

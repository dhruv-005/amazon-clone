'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetRelatedProductsQuery } from '@/store/api/productApi';
import Rating from '../ui/Rating';

interface SimilarProductsProps {
  productId: string;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({ productId }) => {
  const { data } = useGetRelatedProductsQuery(productId);
  const products = data?.data?.products || [];

  if (products.length === 0) return null;

  return (
    <div className="my-8 p-5 bg-white border border-gray-200 rounded shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Products related to this item</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {products.slice(0, 6).map((item) => (
          <Link
            key={item._id}
            href={`/products/${item._id}`}
            className="group flex flex-col justify-between p-2 rounded hover:shadow-md border border-transparent hover:border-gray-200 transition"
          >
            <div className="relative h-36 w-full mb-2 bg-white">
              <Image
                src={item.images?.[0]?.url || '/placeholder.jpg'}
                alt={item.title}
                fill
                className="object-contain p-1 group-hover:scale-105 transition-transform"
                sizes="150px"
              />
            </div>
            <div>
              <h3 className="text-xs text-gray-800 line-clamp-2 group-hover:text-orange-600 font-medium">
                {item.title}
              </h3>
              <div className="my-1">
                <Rating value={item.ratings?.average || 0} count={item.ratings?.count || 0} size="sm" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                ₹{item.price.current.toLocaleString('en-IN')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;

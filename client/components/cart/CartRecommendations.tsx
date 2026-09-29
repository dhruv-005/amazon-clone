'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetFeaturedProductsQuery } from '@/store/api/productApi';
import Rating from '../ui/Rating';
import { useAppDispatch } from '@/store/hooks';
import { addItemLocal } from '@/store/slices/cartSlice';

export const CartRecommendations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data } = useGetFeaturedProductsQuery();
  const products = data?.data?.products || [];

  if (products.length === 0) return null;

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-3">
        Customers who bought items in your cart also bought
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.slice(0, 6).map((product) => (
          <div
            key={product._id}
            className="p-2 border border-transparent hover:border-gray-200 rounded flex flex-col justify-between transition"
          >
            <div>
              <Link href={`/products/${product._id}`} className="block relative h-28 w-full mb-1">
                <Image
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-contain p-1"
                  sizes="120px"
                />
              </Link>
              <Link
                href={`/products/${product._id}`}
                className="text-[11px] text-gray-800 line-clamp-2 hover:text-[#c45500] hover:underline"
              >
                {product.title}
              </Link>
              <div className="my-0.5">
                <Rating value={product.ratings?.average || 0} size="sm" showCount={false} />
              </div>
              <span className="text-xs font-bold text-[#b12704]">
                ₹{product.price.current.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => dispatch(addItemLocal({ product, quantity: 1 }))}
              className="mt-2 w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[11px] font-medium py-1 rounded-full border border-[#fcd200]"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartRecommendations;

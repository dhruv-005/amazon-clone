'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { useAppDispatch } from '@/store/hooks';
import { addItemLocal } from '@/store/slices/cartSlice';

interface ProductListProps {
  product: Product;
}

export const ProductList: React.FC<ProductListProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addItemLocal({ product, quantity: 1 }));
  };

  const discount =
    product.price.discount ||
    Math.round(((product.price.original - product.price.current) / product.price.original) * 100);

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md transition">
      {/* Thumbnail */}
      <Link href={`/products/${product._id}`} className="relative h-48 w-full sm:w-56 flex-shrink-0 bg-white">
        <Image
          src={product.images?.[0]?.url || '/placeholder.jpg'}
          alt={product.title}
          fill
          className="object-contain p-2"
          sizes="224px"
        />
      </Link>

      {/* Info Column */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {product.isFeatured && (
            <div className="mb-1">
              <Badge type="amazons-choice" />
            </div>
          )}

          <Link href={`/products/${product._id}`}>
            <h3 className="text-base font-medium text-gray-900 hover:text-orange-600 hover:underline leading-snug">
              {product.title}
            </h3>
          </Link>

          <div className="my-1.5">
            <Rating value={product.ratings?.average || 0} count={product.ratings?.count || 0} size="sm" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price.current.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  M.R.P: ₹{product.price.original.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#cc0c39]">({discount}% off)</span>
              </>
            )}
          </div>

          {product.shipping?.isPrimeEligible && (
            <p className="text-xs font-bold text-[#007185] mt-1">
              <span className="text-[#00a8e1]">prime</span> FREE Delivery by Tomorrow
            </p>
          )}

          <p className="text-xs text-gray-600 line-clamp-2 mt-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-medium py-1.5 px-5 rounded-full border border-[#fcd200] shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

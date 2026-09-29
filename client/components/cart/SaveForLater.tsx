'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItemLocal } from '@/store/slices/cartSlice';
import { removeWishlistLocal } from '@/store/slices/wishlistSlice';

export const SaveForLater: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  if (wishlistItems.length === 0) return null;

  const handleMoveToCart = (product: any) => {
    dispatch(addItemLocal({ product, quantity: 1 }));
    dispatch(removeWishlistLocal(product._id));
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Saved for later ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {wishlistItems.map(({ _id, product }) => (
          <div
            key={_id}
            className="border border-gray-200 rounded p-3 flex flex-col justify-between bg-white hover:shadow transition"
          >
            <div>
              <Link href={`/products/${product._id}`} className="block relative h-36 w-full mb-2 bg-white">
                <Image
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  className="object-contain p-1"
                  sizes="150px"
                />
              </Link>
              <Link
                href={`/products/${product._id}`}
                className="text-xs text-gray-800 font-medium hover:text-[#c45500] hover:underline line-clamp-2"
              >
                {product.title}
              </Link>
              <p className="text-sm font-bold text-gray-900 mt-1">
                ₹{product.price.current.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-[#007600] font-bold">In stock</p>
            </div>

            <div className="mt-3 space-y-1.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleMoveToCart(product)}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-medium py-1.5 rounded-full border border-[#fcd200] shadow-sm"
              >
                Move to Cart
              </button>
              <button
                onClick={() => dispatch(removeWishlistLocal(product._id))}
                className="w-full text-xs text-[#007185] hover:text-[#c45500] hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaveForLater;

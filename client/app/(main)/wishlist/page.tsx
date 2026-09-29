'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeWishlistLocal } from '@/store/slices/wishlistSlice';
import { addItemLocal } from '@/store/slices/cartSlice';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <Breadcrumb items={[{ label: 'Your Account', href: '/account' }, { label: 'Your Wishlist' }]} />

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">Your Wish List</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded border border-gray-200 space-y-2">
          <p className="text-base font-bold text-gray-800">Your Wishlist is empty</p>
          <p className="text-xs text-gray-500">Explore items and tap the heart icon to save them for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlistItems.map(({ _id, product }) => (
            <div key={_id} className="bg-white border rounded p-4 flex flex-col justify-between shadow-sm">
              <div>
                <Link href={`/products/${product._id}`} className="block relative h-40 w-full mb-2">
                  <Image src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.title} fill className="object-contain" />
                </Link>
                <Link href={`/products/${product._id}`} className="text-xs font-semibold text-gray-900 hover:text-orange-600 line-clamp-2">
                  {product.title}
                </Link>
                <p className="text-sm font-bold text-gray-900 mt-1">₹{product.price?.current?.toLocaleString('en-IN')}</p>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  onClick={() => {
                    dispatch(addItemLocal({ product, quantity: 1 }));
                    dispatch(removeWishlistLocal(product._id));
                  }}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black text-xs font-semibold py-1.5 rounded-full border border-[#fcd200]"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => dispatch(removeWishlistLocal(product._id))}
                  className="w-full text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

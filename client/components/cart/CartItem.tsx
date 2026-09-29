'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';
import { useAppDispatch } from '@/store/hooks';
import {
  updateQuantityLocal,
  removeItemLocal,
} from '@/store/slices/cartSlice';
import { addWishlistLocal } from '@/store/slices/wishlistSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { product, quantity, variant } = item;

  const handleQuantityChange = (newQty: number) => {
    if (newQty <= 0) {
      dispatch(removeItemLocal(item._id));
    } else {
      dispatch(updateQuantityLocal({ itemId: item._id, quantity: newQty }));
    }
  };

  const handleSaveForLater = () => {
    dispatch(addWishlistLocal(product));
    dispatch(removeItemLocal(item._id));
  };

  const price = product?.price?.current || 0;
  const originalPrice = product?.price?.original || 0;

  return (
    <div className="py-5 border-b border-gray-200 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between bg-white">
      {/* Product Image */}
      <Link
        href={`/products/${product?._id}`}
        className="relative w-full sm:w-44 h-44 flex-shrink-0 bg-white"
      >
        <Image
          src={product?.images?.[0]?.url || '/placeholder.jpg'}
          alt={product?.title || 'Cart product'}
          fill
          className="object-contain p-2 hover:scale-105 transition-transform"
          sizes="176px"
        />
      </Link>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-3">
            <Link
              href={`/products/${product?._id}`}
              className="text-base sm:text-lg font-medium text-gray-900 hover:text-[#c45500] hover:underline leading-snug"
            >
              {product?.title}
            </Link>
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap sm:hidden">
              ₹{(price * quantity).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Stock state */}
          <p className="text-xs text-[#007600] font-bold mt-1">In stock</p>

          {/* Prime / Free Shipping */}
          {product?.shipping?.isFreeShipping && (
            <p className="text-xs text-gray-500 mt-0.5">
              Eligible for <span className="font-semibold text-gray-800">FREE Shipping</span>
            </p>
          )}

          {/* Variant tag if any */}
          {variant && (
            <p className="text-xs text-gray-600 mt-1">
              <strong>{variant.name}:</strong> {variant.value}
            </p>
          )}

          {/* Gift option */}
          <label className="flex items-center gap-2 mt-2 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded text-orange-500 focus:ring-orange-400"
            />
            <span>This is a gift <span className="text-[#007185] hover:underline">Learn more</span></span>
          </label>
        </div>

        {/* Action Toolbar (Quantity dropdown, Delete, Save for Later) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[#007185] pt-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#f0f2f2] border border-gray-300 rounded-lg px-2 py-1 shadow-sm">
            <label htmlFor={`qty-${item._id}`} className="text-[11px] text-gray-700 mr-1.5 font-bold">
              Qty:
            </label>
            <select
              id={`qty-${item._id}`}
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-gray-900 outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <span className="text-gray-300">|</span>

          <button
            onClick={() => dispatch(removeItemLocal(item._id))}
            className="hover:text-[#c45500] hover:underline"
          >
            Delete
          </button>

          <span className="text-gray-300">|</span>

          <button
            onClick={handleSaveForLater}
            className="hover:text-[#c45500] hover:underline"
          >
            Save for later
          </button>

          <span className="text-gray-300">|</span>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`${window.location.origin}/products/${product?._id}`);
                alert('Product link copied to clipboard!');
              }
            }}
            className="hover:text-[#c45500] hover:underline"
          >
            Share
          </button>
        </div>
      </div>

      {/* Price Column (Desktop) */}
      <div className="hidden sm:block text-right flex-shrink-0">
        <span className="text-lg font-bold text-gray-900 block">
          ₹{(price * quantity).toLocaleString('en-IN')}
        </span>
        {originalPrice > price && (
          <span className="text-xs text-gray-400 line-through block">
            ₹{(originalPrice * quantity).toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartItem;

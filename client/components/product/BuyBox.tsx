'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItemLocal } from '@/store/slices/cartSlice';
import StockStatus from './StockStatus';

interface BuyBoxProps {
  product: Product;
}

export const BuyBox: React.FC<BuyBoxProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const user = useAppSelector((state) => state.auth.user);
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const price = product.dealInfo?.dealPrice || product.price.current;

  const handleAddToCart = () => {
    dispatch(addItemLocal({ product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addItemLocal({ product, quantity }));
    router.push('/checkout');
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm space-y-3.5 sticky top-24 text-xs select-none">
      {/* Price */}
      <div>
        <div className="flex items-baseline">
          <span className="text-xs font-bold text-gray-900">₹</span>
          <span className="text-2xl font-bold text-gray-900">
            {price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="space-y-1">
        <p className="text-[#007185] font-bold">
          FREE delivery <span className="text-gray-900">Tomorrow by 9 PM</span>.
        </p>
        <p className="text-gray-600">
          Delivering to {defaultAddr ? `${defaultAddr.city} ${defaultAddr.pincode}` : 'India'}
        </p>
      </div>

      {/* Stock Urgency */}
      <StockStatus stock={product.stock} />

      {/* Quantity Dropdown */}
      {product.stock > 0 && (
        <div className="flex items-center gap-2">
          <label htmlFor="qty-select" className="font-semibold text-gray-700">
            Quantity:
          </label>
          <select
            id="qty-select"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-[#f0f2f2] border border-gray-300 rounded px-2.5 py-1 text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-orange-400"
          >
            {[...Array(Math.min(product.stock, 10))].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons */}
      {product.stock > 0 ? (
        <div className="space-y-2 pt-1">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-black font-medium py-2 rounded-full border border-[#fcd200] shadow-sm transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e67a00] text-black font-medium py-2 rounded-full border border-[#ff8f00] shadow-sm transition"
          >
            Buy Now
          </button>
        </div>
      ) : (
        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 font-medium py-2 rounded-full cursor-not-allowed"
        >
          Currently Unavailable
        </button>
      )}

      {/* Security & Seller Details */}
      <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 space-y-1.5">
        <div className="flex justify-between">
          <span>Payment</span>
          <span className="text-gray-800 font-medium">Cash on Delivery (COD)</span>
        </div>
        <div className="flex justify-between">
          <span>Ships from</span>
          <span className="text-gray-800 font-medium">Amazon Fulfilled</span>
        </div>
        <div className="flex justify-between">
          <span>Sold by</span>
          <span className="text-[#007185] font-medium truncate max-w-[130px]">
            {product.seller?.businessName || product.seller?.name || 'Retail Net'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Returns</span>
          <span className="text-[#007185]">10 days Returnable</span>
        </div>
      </div>
    </div>
  );
};

export default BuyBox;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useGetFrequentlyBoughtTogetherQuery } from '@/store/api/productApi';
import { useAppDispatch } from '@/store/hooks';
import { addItemLocal } from '@/store/slices/cartSlice';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
}) => {
  const dispatch = useAppDispatch();
  const { data } = useGetFrequentlyBoughtTogetherQuery(currentProduct._id);
  const bundleCandidates = data?.data?.products?.slice(0, 2) || [];

  const [selectedIds, setSelectedIds] = useState<string[]>([
    currentProduct._id,
    ...bundleCandidates.map((p) => p._id),
  ]);

  if (bundleCandidates.length === 0) return null;

  const allItems = [currentProduct, ...bundleCandidates];
  const activeItems = allItems.filter((item) => selectedIds.includes(item._id));
  const totalPrice = activeItems.reduce((sum, item) => sum + item.price.current, 0);

  const toggleSelect = (id: string) => {
    if (id === currentProduct._id) return; // Main product cannot be unselected
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddAllToCart = () => {
    activeItems.forEach((item) => {
      dispatch(addItemLocal({ product: item, quantity: 1 }));
    });
  };

  return (
    <div className="my-8 p-5 bg-white border border-gray-200 rounded shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently bought together</h2>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Images Row */}
        <div className="flex items-center gap-3">
          {allItems.map((item, idx) => (
            <React.Fragment key={item._id}>
              {idx > 0 && <span className="text-xl font-bold text-gray-400">+</span>}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 border rounded p-2 bg-white ${
                  selectedIds.includes(item._id) ? 'border-gray-300' : 'opacity-40 border-dashed'
                }`}
              >
                <Image
                  src={item.images?.[0]?.url || '/placeholder.jpg'}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Bundle Summary & Action */}
        <div className="flex-1 lg:border-l lg:border-gray-200 lg:pl-6 space-y-2 text-xs">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-700">Total price:</span>
            <span className="text-xl font-bold text-[#b12704]">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddAllToCart}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black font-medium py-1.5 px-6 rounded-full border border-[#fcd200] shadow-sm"
          >
            Add all {activeItems.length} to Cart
          </button>

          {/* Checkboxes List */}
          <div className="space-y-1.5 pt-2">
            {allItems.map((item) => (
              <label key={item._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  disabled={item._id === currentProduct._id}
                  onChange={() => toggleSelect(item._id)}
                  className="rounded text-orange-500 focus:ring-orange-400"
                />
                <span className="text-gray-800 line-clamp-1">
                  <strong>{item._id === currentProduct._id ? 'This item: ' : ''}</strong>
                  {item.title} — <strong className="text-black">₹{item.price.current.toLocaleString('en-IN')}</strong>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;

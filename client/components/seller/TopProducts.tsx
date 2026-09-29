'use client';

import React from 'react';
import { Product } from '@/types/product';

interface TopProductsProps {
  products: Product[];
}

export const TopProducts: React.FC<TopProductsProps> = ({ products = [] }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3 text-xs">
      <h3 className="font-bold text-sm text-gray-900 border-b pb-2">Top Selling Listings</h3>
      <div className="space-y-3">
        {products.slice(0, 5).map((p, idx) => (
          <div key={p._id} className="flex items-center justify-between gap-3">
            <span className="font-bold text-gray-400">#{idx + 1}</span>
            <span className="font-medium text-gray-800 flex-1 truncate">{p.title}</span>
            <span className="font-bold text-gray-900">{p.totalSold || 0} sold</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;

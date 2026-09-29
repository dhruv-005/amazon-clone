'use client';

import React from 'react';
import { useGetCategoryTreeQuery } from '@/store/api/productApi';

export const CategoryTree: React.FC = () => {
  const { data } = useGetCategoryTreeQuery();
  const categories = data?.data?.categories || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 text-xs">
      <h3 className="font-bold text-sm text-gray-900">Category Catalog Tree</h3>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c._id} className="p-2 border rounded bg-gray-50 font-bold text-gray-900">
            📁 {c.name} <span className="text-gray-400 font-normal">(/category/{c.slug})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryTree;

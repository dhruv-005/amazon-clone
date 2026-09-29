'use client';

import React from 'react';
import Link from 'next/link';
import { useGetCategoriesQuery } from '@/store/api/productApi';

interface CategoryFilterProps {
  currentSlug?: string;
  onSelectCategory?: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  currentSlug,
  onSelectCategory,
}) => {
  const { data } = useGetCategoriesQuery();
  const categories = data?.data?.categories || [];

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      <h3 className="font-bold text-sm text-gray-900">Department</h3>
      <ul className="space-y-1.5 text-xs text-gray-800">
        <li>
          <Link
            href="/products"
            className={`hover:text-orange-600 ${!currentSlug ? 'font-bold text-black' : ''}`}
          >
            All Departments
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat._id}>
            <button
              onClick={() => onSelectCategory?.(cat.slug)}
              className={`text-left hover:text-orange-600 hover:underline w-full truncate ${
                currentSlug === cat.slug ? 'font-bold text-orange-700' : ''
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;

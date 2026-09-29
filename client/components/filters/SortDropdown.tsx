'use client';

import React from 'react';

interface SortDropdownProps {
  currentSort?: string;
  onSortChange: (sortValue: string) => void;
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'popular', label: 'Best Sellers' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort = 'featured',
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-2 text-xs select-none">
      <label htmlFor="sort-select" className="text-gray-600 font-medium">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-[#f0f2f2] hover:bg-[#e3e6e6] text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 font-medium outline-none cursor-pointer focus:ring-2 focus:ring-orange-400 shadow-sm"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;

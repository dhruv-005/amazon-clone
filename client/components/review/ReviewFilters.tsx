'use client';

import React from 'react';

interface ReviewFiltersProps {
  currentFilter?: string;
  onFilterChange: (val: string) => void;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({ currentFilter = 'all', onFilterChange }) => {
  return (
    <div className="flex gap-2 text-xs select-none">
      {['all', 'positive', 'critical', 'verified'].map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-3 py-1 rounded-full border capitalize font-medium ${
            currentFilter === f
              ? 'bg-[#131921] text-white border-[#131921]'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default ReviewFilters;

'use client';

import React from 'react';

interface AppliedFiltersProps {
  selectedBrand?: string;
  selectedRating?: number;
  minPrice?: number;
  maxPrice?: number;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
}

export const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  selectedBrand,
  selectedRating,
  minPrice,
  maxPrice,
  onClearFilter,
  onClearAll,
}) => {
  const hasFilters = selectedBrand || selectedRating || minPrice || maxPrice;

  if (!hasFilters) return null;

  return (
    <div className="border-b border-gray-200 pb-3 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs text-gray-800">Active Filters</h3>
        <button
          onClick={onClearAll}
          className="text-[11px] text-[#007185] hover:text-[#c45500] hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selectedBrand && (
          <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800">
            <span>Brand: {selectedBrand}</span>
            <button onClick={() => onClearFilter('brand')} className="hover:text-red-600 font-bold">
              ×
            </button>
          </span>
        )}

        {selectedRating && (
          <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800">
            <span>{selectedRating}★ & Up</span>
            <button onClick={() => onClearFilter('rating')} className="hover:text-red-600 font-bold">
              ×
            </button>
          </span>
        )}

        {(minPrice || maxPrice) && (
          <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800">
            <span>
              ₹{minPrice || 0} - {maxPrice ? `₹${maxPrice}` : 'Above'}
            </span>
            <button
              onClick={() => {
                onClearFilter('minPrice');
                onClearFilter('maxPrice');
              }}
              className="hover:text-red-600 font-bold"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;

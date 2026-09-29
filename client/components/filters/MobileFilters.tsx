'use client';

import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import Modal from '../ui/Modal';

interface MobileFiltersProps {
  categorySlug?: string;
  selectedBrand?: string;
  selectedRating?: number;
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (key: string, value: any) => void;
  onClearAll: () => void;
}

export const MobileFilters: React.FC<MobileFiltersProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white text-xs font-bold text-gray-800 shadow-sm"
      >
        <svg className="w-4 h-4 fill-current text-gray-600" viewBox="0 0 24 24">
          <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
        </svg>
        <span>Filters</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filter Results">
        <FilterSidebar
          {...props}
          className="w-full"
          onFilterChange={(k, v) => {
            props.onFilterChange(k, v);
          }}
        />
      </Modal>
    </div>
  );
};

export default MobileFilters;

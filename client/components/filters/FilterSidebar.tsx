'use client';

import React from 'react';
import CategoryFilter from './CategoryFilter';
import RatingFilter from './RatingFilter';
import PriceFilter from './PriceFilter';
import BrandFilter from './BrandFilter';
import ColorFilter from './ColorFilter';
import SizeFilter from './SizeFilter';
import AppliedFilters from './AppliedFilters';

interface FilterSidebarProps {
  categorySlug?: string;
  selectedBrand?: string;
  selectedRating?: number;
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (key: string, value: any) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categorySlug,
  selectedBrand,
  selectedRating,
  minPrice,
  maxPrice,
  onFilterChange,
  onClearAll,
  className = '',
}) => {
  return (
    <aside className={`w-60 flex-shrink-0 text-xs text-gray-900 space-y-5 select-none ${className}`}>
      {/* Active Filter Chips */}
      <AppliedFilters
        selectedBrand={selectedBrand}
        selectedRating={selectedRating}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onClearFilter={(key) => onFilterChange(key, undefined)}
        onClearAll={onClearAll}
      />

      {/* Delivery / Prime */}
      <div className="space-y-2 border-b border-gray-200 pb-4">
        <h3 className="font-bold text-sm text-gray-900">Amazon Prime</h3>
        <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
          <input
            type="checkbox"
            className="rounded text-orange-500 focus:ring-orange-400"
            onChange={(e) => onFilterChange('primeOnly', e.target.checked ? true : undefined)}
          />
          <span className="font-bold text-[#00a8e1] tracking-tighter text-sm">prime</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
          <input
            type="checkbox"
            className="rounded text-orange-500 focus:ring-orange-400"
            onChange={(e) => onFilterChange('freeShipping', e.target.checked ? true : undefined)}
          />
          <span>Eligible for Free Shipping</span>
        </label>
      </div>

      {/* Category Tree Filter */}
      <CategoryFilter
        currentSlug={categorySlug}
        onSelectCategory={(slug) => onFilterChange('category', slug)}
      />

      {/* Customer Reviews Rating Filter */}
      <RatingFilter
        selectedRating={selectedRating}
        onSelectRating={(rating) => onFilterChange('rating', rating)}
      />

      {/* Price Range Filter */}
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(min, max) => {
          onFilterChange('minPrice', min);
          onFilterChange('maxPrice', max);
        }}
      />

      {/* Brand Checkbox List */}
      <BrandFilter
        selectedBrand={selectedBrand}
        onSelectBrand={(brand) => onFilterChange('brand', brand)}
      />

      {/* Color Filter */}
      <ColorFilter
        onSelectColor={(color) => onFilterChange('color', color)}
      />

      {/* Size Filter */}
      <SizeFilter
        onSelectSize={(size) => onFilterChange('size', size)}
      />

      {/* Pay on Delivery Toggle */}
      <div className="space-y-2 pt-1 border-t border-gray-200">
        <h3 className="font-bold text-sm text-gray-900">Pay On Delivery</h3>
        <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
          <input
            type="checkbox"
            defaultChecked
            className="rounded text-orange-500 focus:ring-orange-400"
          />
          <span>Eligible for Pay On Delivery</span>
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;

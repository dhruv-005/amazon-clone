'use client';

import React, { useState } from 'react';

interface BrandFilterProps {
  selectedBrand?: string;
  onSelectBrand: (brand?: string) => void;
}

const defaultBrands = ['Apple', 'Samsung', 'Sony', 'boAt', 'Nike', 'Dell'];

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onSelectBrand,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = defaultBrands.filter((b) =>
    b.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      <h3 className="font-bold text-sm text-gray-900">Brand</h3>

      {defaultBrands.length > 5 && (
        <input
          type="text"
          placeholder="Search brand"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded mb-1 outline-none focus:border-orange-500"
        />
      )}

      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        {filtered.map((brand) => {
          const isChecked = selectedBrand?.toLowerCase() === brand.toLowerCase();

          return (
            <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onSelectBrand(isChecked ? undefined : brand)}
                className="rounded text-orange-500 focus:ring-orange-400"
              />
              <span className="text-xs text-gray-800">{brand}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default BrandFilter;

'use client';

import React, { useState } from 'react';

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
}) => {
  const [min, setMin] = useState(minPrice?.toString() || '');
  const [max, setMax] = useState(maxPrice?.toString() || '');

  const presets = [
    { label: 'Under ₹1,000', min: undefined, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 1000 },
    { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { label: 'Over ₹20,000', min: 20000, max: undefined },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange(min ? Number(min) : undefined, max ? Number(max) : undefined);
  };

  return (
    <div className="space-y-3 border-b border-gray-200 pb-4">
      <h3 className="font-bold text-sm text-gray-900">Price</h3>

      {/* Presets List */}
      <ul className="space-y-1 text-xs text-gray-800">
        {presets.map((p, idx) => (
          <li key={idx}>
            <button
              onClick={() => {
                setMin(p.min?.toString() || '');
                setMax(p.max?.toString() || '');
                onPriceChange(p.min, p.max);
              }}
              className="hover:text-orange-600 hover:underline block py-0.5 text-left w-full"
            >
              {p.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Min - Max Input Form */}
      <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5 pt-1">
        <div className="relative flex items-center">
          <span className="absolute left-2 text-gray-400 text-xs">₹</span>
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-20 pl-5 pr-1.5 py-1 text-xs border border-gray-400 rounded outline-none focus:border-orange-500"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex items-center">
          <span className="absolute left-2 text-gray-400 text-xs">₹</span>
          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-20 pl-5 pr-1.5 py-1 text-xs border border-gray-400 rounded outline-none focus:border-orange-500"
          />
        </div>
        <button
          type="submit"
          className="px-2.5 py-1 text-xs bg-white border border-gray-400 hover:bg-gray-100 rounded shadow-sm font-medium"
        >
          Go
        </button>
      </form>
    </div>
  );
};

export default PriceFilter;

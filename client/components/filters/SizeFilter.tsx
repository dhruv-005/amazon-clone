'use client';

import React, { useState } from 'react';

interface SizeFilterProps {
  onSelectSize: (size?: string) => void;
}

const sizes = ['S', 'M', 'L', 'XL', '2XL', '6 UK', '7 UK', '8 UK', '9 UK', '10 UK'];

export const SizeFilter: React.FC<SizeFilterProps> = ({ onSelectSize }) => {
  const [activeSize, setActiveSize] = useState<string | null>(null);

  const handleClick = (s: string) => {
    const next = activeSize === s ? null : s;
    setActiveSize(next);
    onSelectSize(next || undefined);
  };

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      <h3 className="font-bold text-sm text-gray-900">Size</h3>
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => handleClick(s)}
            className={`px-2 py-1 text-xs border rounded transition ${
              activeSize === s
                ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold'
                : 'border-gray-300 bg-white hover:border-gray-400 text-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;

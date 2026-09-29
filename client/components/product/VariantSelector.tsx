'use client';

import React, { useState } from 'react';
import { ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  variants?: ProductVariant[];
  onSelect?: (variantName: string, optionValue: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants = [],
  onSelect,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  if (!variants || variants.length === 0) return null;

  const handleSelect = (variantName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [variantName]: value }));
    onSelect?.(variantName, value);
  };

  return (
    <div className="space-y-4 py-3 border-y border-gray-200">
      {variants.map((variant) => (
        <div key={variant.name} className="space-y-2">
          <div className="text-xs">
            <span className="text-gray-600 font-medium">{variant.name}: </span>
            <span className="font-bold text-gray-900">
              {selectedOptions[variant.name] || variant.options[0]?.value}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {variant.options.map((opt) => {
              const isSelected =
                (selectedOptions[variant.name] || variant.options[0]?.value) === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(variant.name, opt.value)}
                  className={`px-3 py-1.5 border text-xs font-semibold rounded-md transition ${
                    isSelected
                      ? 'border-[#e77600] bg-orange-50 text-gray-900 ring-1 ring-[#e77600]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                  }`}
                >
                  {opt.value}
                  {opt.price && <span className="ml-1 text-gray-500">₹{opt.price}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;

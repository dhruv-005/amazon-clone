'use client';

import React, { useState } from 'react';

interface ColorFilterProps {
  onSelectColor: (color?: string) => void;
}

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Blue', hex: '#1E40AF' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Silver', hex: '#9CA3AF' },
  { name: 'Gold', hex: '#D97706' },
];

export const ColorFilter: React.FC<ColorFilterProps> = ({ onSelectColor }) => {
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const handleClick = (name: string) => {
    const next = activeColor === name ? null : name;
    setActiveColor(next);
    onSelectColor(next || undefined);
  };

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      <h3 className="font-bold text-sm text-gray-900">Colour</h3>
      <div className="flex flex-wrap gap-2 pt-1">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            title={c.name}
            onClick={() => handleClick(c.name)}
            className={`w-6 h-6 rounded-full transition-transform ${
              c.border ? 'border border-gray-300' : ''
            } ${activeColor === c.name ? 'ring-2 ring-orange-500 ring-offset-1 scale-110' : 'hover:scale-105'}`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;

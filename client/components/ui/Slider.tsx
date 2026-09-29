'use client';

import React from 'react';

export interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onChange,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between text-xs text-gray-700 font-medium">
        {label && <span>{label}</span>}
        <span>₹{value.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
    </div>
  );
};

export default Slider;

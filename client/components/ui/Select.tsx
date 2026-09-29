'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substring(2, 9);

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-gray-800">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`bg-[#f0f2f2] hover:bg-[#e3e6e6] text-xs font-medium text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer shadow-sm ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;

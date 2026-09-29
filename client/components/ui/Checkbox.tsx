'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);

    return (
      <label htmlFor={inputId} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`w-4 h-4 text-orange-500 bg-white border-gray-400 rounded focus:ring-orange-400 focus:ring-2 cursor-pointer ${className}`}
          {...props}
        />
        {label && <span className="text-xs text-gray-800">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;

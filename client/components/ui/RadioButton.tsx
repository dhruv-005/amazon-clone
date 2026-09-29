'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(2, 9);

    return (
      <label htmlFor={inputId} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className={`w-4 h-4 text-orange-500 border-gray-400 focus:ring-orange-400 cursor-pointer ${className}`}
          {...props}
        />
        {label && <span className="text-xs text-gray-800 font-medium">{label}</span>}
      </label>
    );
  }
);

RadioButton.displayName = 'RadioButton';
export default RadioButton;

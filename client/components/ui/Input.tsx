'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-gray-800 tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-gray-400 pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-white text-gray-900 text-sm rounded border border-gray-400 px-3 py-2 transition-all outline-none
              placeholder:text-gray-400
              focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/30 focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]
              ${leftIcon ? 'pl-9' : ''}
              ${rightIcon ? 'pr-9' : ''}
              ${error ? 'border-red-600 focus:border-red-600 focus:ring-red-200' : ''}
              ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-gray-400">{rightIcon}</div>}
        </div>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-gray-500">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

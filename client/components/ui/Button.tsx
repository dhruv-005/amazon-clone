'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed select-none shadow-sm active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] focus:ring-[#e77600] active:bg-[#f0b800]',
      secondary:
        'bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] focus:ring-[#e77600] active:bg-[#e67a00]',
      dark:
        'bg-[#131921] hover:bg-[#232f3e] text-white border border-[#131921] focus:ring-orange-400 active:bg-black',
      outline:
        'bg-white hover:bg-gray-50 text-[#0f1111] border border-gray-300 focus:ring-orange-400 active:bg-gray-100 shadow-none',
      ghost:
        'bg-transparent hover:bg-gray-100 text-gray-700 shadow-none focus:ring-gray-300 active:bg-gray-200',
      danger:
        'bg-red-600 hover:bg-red-700 text-white border border-red-600 focus:ring-red-500 active:bg-red-800',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

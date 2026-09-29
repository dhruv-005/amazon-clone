'use client';

import React from 'react';

interface CartHeaderProps {
  itemCount: number;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ itemCount }) => {
  return (
    <div className="border-b border-gray-200 pb-3 flex items-baseline justify-between select-none">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Shopping Cart
        </h1>
        {itemCount > 0 && (
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('deselect-all-cart'));
              }
            }}
            className="text-xs text-[#007185] hover:text-[#c45500] hover:underline mt-1 inline-block"
          >
            Deselect all items
          </button>
        )}
      </div>
      <span className="text-xs text-gray-500 font-medium hidden sm:inline">
        Price
      </span>
    </div>
  );
};

export default CartHeader;

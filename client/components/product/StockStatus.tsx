'use client';

import React from 'react';

interface StockStatusProps {
  stock: number;
}

export const StockStatus: React.FC<StockStatusProps> = ({ stock }) => {
  if (stock <= 0) {
    return <span className="text-base font-bold text-[#cc0c39] block">Currently unavailable.</span>;
  }

  if (stock <= 5) {
    return (
      <span className="text-sm font-bold text-[#b12704] block">
        Only {stock} left in stock - order soon.
      </span>
    );
  }

  return <span className="text-base font-bold text-[#007600] block">In stock</span>;
};

export default StockStatus;

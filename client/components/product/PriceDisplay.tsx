'use client';

import React from 'react';

interface PriceDisplayProps {
  current: number;
  original: number;
  discount?: number;
  dealPrice?: number;
  isDeal?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  current,
  original,
  discount = 0,
  dealPrice,
  isDeal = false,
}) => {
  const activePrice = isDeal && dealPrice ? dealPrice : current;
  const calculatedDiscount =
    discount ||
    (original > activePrice ? Math.round(((original - activePrice) / original) * 100) : 0);

  return (
    <div className="space-y-1">
      {isDeal && (
        <div className="inline-block bg-[#cc0c39] text-white font-bold text-xs px-2 py-0.5 rounded-sm">
          Limited time deal
        </div>
      )}

      <div className="flex items-baseline gap-2">
        {calculatedDiscount > 0 && (
          <span className="text-2xl sm:text-3xl text-[#cc0c39] font-light">
            -{calculatedDiscount}%
          </span>
        )}
        <div className="flex items-start">
          <span className="text-xs font-medium text-gray-900 mt-1">₹</span>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {activePrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {original > activePrice && (
        <p className="text-xs text-gray-500">
          M.R.P.: <span className="line-through">₹{original.toLocaleString('en-IN')}</span>
        </p>
      )}

      <p className="text-xs text-gray-700">
        Inclusive of all taxes. <strong>Cash on Delivery (COD) available.</strong>
      </p>
    </div>
  );
};

export default PriceDisplay;

'use client';

import React from 'react';

export interface BadgeProps {
  type: 'amazons-choice' | 'best-seller' | 'prime' | 'deal' | 'discount';
  text?: string;
  discountPercent?: number;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, discountPercent }) => {
  switch (type) {
    case 'amazons-choice':
      return (
        <span className="inline-flex items-center bg-[#232f3e] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm gap-1">
          <span>Amazon's</span> <span className="text-orange-400 font-normal">Choice</span>
        </span>
      );
    case 'best-seller':
      return (
        <span className="inline-flex items-center bg-[#e67a00] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
          #1 Best Seller
        </span>
      );
    case 'prime':
      return (
        <span className="inline-flex items-center text-[#00a8e1] font-bold text-xs tracking-tighter">
          prime
        </span>
      );
    case 'deal':
      return (
        <span className="inline-flex items-center bg-[#cc0c39] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
          {text || 'Limited time deal'}
        </span>
      );
    case 'discount':
      return (
        <span className="inline-flex items-center text-xs font-semibold text-[#cc0c39]">
          {discountPercent ? `-${discountPercent}%` : text}
        </span>
      );
    default:
      return null;
  }
};

export default Badge;

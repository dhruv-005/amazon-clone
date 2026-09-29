'use client';

import React from 'react';
import Link from 'next/link';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#131921] text-gray-300 text-[11px] px-4 py-1 hidden sm:flex justify-between items-center border-b border-gray-800">
      <div>
        <span>Free delivery on your first order. </span>
        <Link href="/deals" className="text-orange-400 hover:underline font-semibold">
          Learn more
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/help" className="hover:text-white">
          Help & Customer Care
        </Link>
        <Link href="/seller/dashboard" className="hover:text-white text-orange-400 font-semibold">
          Become a Seller
        </Link>
      </div>
    </div>
  );
};

export default TopBar;

'use client';

import React from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { toggleMegaMenu } from '@/store/slices/uiSlice';
import MegaMenu from './MegaMenu';

const navLinks = [
  { label: 'Fresh', href: '/category/fresh' },
  { label: 'Amazon miniTV', href: '/minitv' },
  { label: 'Sell', href: '/seller/dashboard' },
  { label: 'Best Sellers', href: '/products?sort=popular' },
  { label: "Today's Deals", href: '/deals' },
  { label: 'Mobiles', href: '/category/electronics' },
  { label: 'Prime', href: '/prime' },
  { label: 'Customer Service', href: '/help' },
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Home & Kitchen', href: '/category/home-kitchen' },
  { label: 'Fashion', href: '/category/fashion' },
  { label: 'Computers', href: '/category/computers-accessories' },
  { label: 'Books', href: '/category/books' },
];

export const CategoryNav: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="bg-[#232f3e] text-white px-3 flex items-center h-[39px] text-xs md:text-sm font-medium overflow-x-auto no-scrollbar shadow-inner">
        {/* "All" Hamburger Button */}
        <button
          onClick={() => dispatch(toggleMegaMenu(true))}
          className="flex items-center gap-1.5 px-2 py-1 border border-transparent hover:border-white rounded-sm whitespace-nowrap font-bold text-white mr-1 transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
          <span>All</span>
        </button>

        {/* Category Links */}
        <div className="flex items-center space-x-0.5 whitespace-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-2 py-1 border border-transparent hover:border-white rounded-sm text-gray-100 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Promo */}
        <div className="ml-auto hidden xl:flex items-center">
          <Link
            href="/deals"
            className="px-2 py-1 text-orange-300 hover:text-white font-bold text-xs border border-transparent hover:border-white rounded-sm"
          >
            Great Republic Day Deals | Shop Now
          </Link>
        </div>
      </div>

      {/* Render Slide-out MegaMenu */}
      <MegaMenu />
    </>
  );
};

export default CategoryNav;

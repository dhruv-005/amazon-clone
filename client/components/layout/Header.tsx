'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './SearchBar';
import LocationSelector from './LocationSelector';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';
import CartIcon from './CartIcon';
import CategoryNav from './CategoryNav';

export const Header: React.FC = () => {
  return (
    <header className="w-full sticky top-0 z-40 select-none">
      {/* Tier 1: Main Dark Bar */}
      <div className="bg-[#131921] text-white px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 md:gap-4 h-[60px]">
        {/* Amazon Logo */}
        <Link
          href="/"
          className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xl font-bold tracking-tight text-white">amazon</span>
            <span className="text-xs text-[#febd69] font-bold mt-1">.in</span>
          </div>
        </Link>

        {/* Deliver To Location */}
        <div className="hidden lg:flex items-center">
          <LocationSelector />
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-3xl mx-1 sm:mx-2">
          <SearchBar />
        </div>

        {/* Right Section: Language, Account, Orders, Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Selector */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
          </div>

          {/* Account & Lists */}
          <UserMenu />

          {/* Returns & Orders */}
          <Link
            href="/orders"
            className="hidden sm:flex flex-col justify-center px-2 py-1 border border-transparent hover:border-white rounded-sm leading-tight transition-colors"
          >
            <span className="text-[11px] text-gray-300 font-normal">Returns</span>
            <span className="text-xs font-bold text-white">& Orders</span>
          </Link>

          {/* Cart Icon */}
          <CartIcon />
        </div>
      </div>

      {/* Tier 2: Category Navigation Strip */}
      <CategoryNav />
    </header>
  );
};

export default Header;

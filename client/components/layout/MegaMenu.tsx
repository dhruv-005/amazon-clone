'use client';

import React from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMegaMenu } from '@/store/slices/uiSlice';
import { useGetCategoryTreeQuery } from '@/store/api/productApi';

export const MegaMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMegaMenuOpen);
  const user = useAppSelector((state) => state.auth.user);

  const { data: categoryTreeData } = useGetCategoryTreeQuery();
  const categories = categoryTreeData?.data?.categories || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Dark Overlay */}
      <div
        onClick={() => dispatch(toggleMegaMenu(false))}
        className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
      />

      {/* Slide-out Panel */}
      <div className="relative w-[365px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideInLeft overflow-hidden">
        {/* Header: User Greeting */}
        <div className="bg-[#232f3e] text-white px-8 py-3.5 flex items-center justify-between">
          <Link
            href={user ? '/account' : '/login'}
            onClick={() => dispatch(toggleMegaMenu(false))}
            className="flex items-center gap-3 font-bold text-lg hover:underline"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span>Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
          </Link>
          <button
            onClick={() => dispatch(toggleMegaMenu(false))}
            className="text-white hover:text-gray-300 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto py-3 divide-y divide-gray-200">
          {/* Trending Section */}
          <div className="px-8 py-3">
            <h3 className="text-base font-bold text-gray-900 mb-2">Trending</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link
                  href="/products?sort=popular"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  New Releases
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Movers and Shakers
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop By Category */}
          <div className="px-8 py-3">
            <h3 className="text-base font-bold text-gray-900 mb-2">Shop by Category</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => dispatch(toggleMegaMenu(false))}
                    className="flex items-center justify-between hover:text-orange-600 py-1"
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-xs">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs & Features */}
          <div className="px-8 py-3">
            <h3 className="text-base font-bold text-gray-900 mb-2">Programs & Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link
                  href="/deals"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/prime"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Amazon Prime
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/dashboard"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Sell on Amazon
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Settings */}
          <div className="px-8 py-3">
            <h3 className="text-base font-bold text-gray-900 mb-2">Help & Settings</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link
                  href="/account"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Your Account
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  onClick={() => dispatch(toggleMegaMenu(false))}
                  className="hover:text-orange-600 block py-1"
                >
                  Customer Service
                </Link>
              </li>
              {user ? (
                <li>
                  <button
                    onClick={() => {
                      dispatch(toggleMegaMenu(false));
                    }}
                    className="text-red-600 hover:underline block py-1"
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    onClick={() => dispatch(toggleMegaMenu(false))}
                    className="text-orange-600 font-bold hover:underline block py-1"
                  >
                    Sign in
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

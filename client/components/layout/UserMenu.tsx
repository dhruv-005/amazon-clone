'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';

export const UserMenu: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();
  const [isHovered, setIsHovered] = useState(false);

  const handleSignOut = async () => {
    try {
      await logoutApi().unwrap();
    } catch {}
    dispatch(logout());
    router.push('/');
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger Button */}
      <Link
        href={user ? '/account' : '/login'}
        className="flex flex-col justify-center px-2 py-1 border border-transparent hover:border-white rounded-sm leading-tight transition-colors cursor-pointer"
      >
        <span className="text-[11px] text-gray-300 font-normal">
          Hello, {user ? user.name.split(' ')[0] : 'sign in'}
        </span>
        <div className="flex items-center gap-0.5">
          <span className="text-xs font-bold text-white">Account & Lists</span>
          <svg className="w-2.5 h-2.5 text-gray-400 fill-current" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </Link>

      {/* Flyout Popover */}
      {isHovered && (
        <div className="absolute right-0 top-full mt-0 w-64 md:w-80 bg-white rounded shadow-2xl border border-gray-200 text-gray-900 z-50 p-4 animate-scaleUp">
          {!user ? (
            <div className="text-center pb-3 border-b border-gray-200">
              <Link
                href="/login"
                className="inline-block w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs py-2 rounded-md shadow-sm border border-[#fcd200]"
              >
                Sign in
              </Link>
              <p className="text-[11px] text-gray-600 mt-2">
                New customer?{' '}
                <Link href="/register" className="text-[#007185] hover:text-orange-600 hover:underline">
                  Start here.
                </Link>
              </p>
            </div>
          ) : (
            <div className="pb-2 mb-2 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate max-w-[180px]">{user.email}</p>
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded capitalize">
                {user.role}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            {/* Left Column: Your Lists */}
            <div className="border-r border-gray-200 pr-3">
              <h4 className="font-bold text-gray-900 mb-2">Your Lists</h4>
              <ul className="space-y-1.5 text-gray-600">
                <li>
                  <Link href="/wishlist" className="hover:text-orange-600 hover:underline block">
                    Your Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-orange-600 hover:underline block">
                    Save for Later
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Column: Your Account */}
            <div className="pl-1">
              <h4 className="font-bold text-gray-900 mb-2">Your Account</h4>
              <ul className="space-y-1.5 text-gray-600">
                <li>
                  <Link href="/account" className="hover:text-orange-600 hover:underline block">
                    Your Account
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-orange-600 hover:underline block">
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link href="/account/addresses" className="hover:text-orange-600 hover:underline block">
                    Your Addresses
                  </Link>
                </li>
                {user?.role === 'seller' && (
                  <li>
                    <Link href="/seller/dashboard" className="text-orange-600 font-bold hover:underline block">
                      Seller Central
                    </Link>
                  </li>
                )}
                {user?.role === 'admin' && (
                  <li>
                    <Link href="/admin/dashboard" className="text-blue-600 font-bold hover:underline block">
                      Admin Panel
                    </Link>
                  </li>
                )}
                {user && (
                  <li className="pt-2 border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="text-red-600 hover:underline font-medium text-left"
                    >
                      Sign Out
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

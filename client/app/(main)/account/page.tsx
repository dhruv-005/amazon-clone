'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

const accountTiles = [
  { title: 'Your Orders', desc: 'Track, return, or buy items again', href: '/orders', icon: '📦' },
  { title: 'Login & Security', desc: 'Edit login, name, and mobile number', href: '/account/security', icon: '🔒' },
  { title: 'Prime Membership', desc: 'Manage your Prime benefits and payments', href: '/prime', icon: '👑' },
  { title: 'Your Addresses', desc: 'Edit addresses for orders and gifts', href: '/account/addresses', icon: '🏠' },
  { title: 'Payment Options', desc: 'Manage Pay on Delivery and refund settings', href: '/account/payments', icon: '💳' },
  { title: 'Your Wish List', desc: 'View, edit, and share your wish lists', href: '/wishlist', icon: '❤️' },
  { title: 'Seller Account', desc: 'Manage your merchant listings and sales', href: '/seller/dashboard', icon: '🏢' },
  { title: 'Customer Service', desc: 'Browse self-service help and chat with us', href: '/help', icon: '🎧' },
];

export default function AccountPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-xs">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Account</h1>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            Logged in as <strong>{user.name}</strong> ({user.email})
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {accountTiles.map((tile) => (
          <Link
            key={tile.title}
            href={tile.href}
            className="bg-white border border-gray-300 rounded-lg p-4 flex items-start gap-4 hover:bg-gray-50 transition shadow-sm group"
          >
            <span className="text-3xl">{tile.icon}</span>
            <div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 leading-tight">
                {tile.title}
              </h3>
              <p className="text-gray-500 mt-1">{tile.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

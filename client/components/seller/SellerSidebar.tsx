'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/seller/dashboard', icon: '📊' },
  { label: 'Products & Inventory', href: '/seller/products', icon: '📦' },
  { label: 'Add New Product', href: '/seller/products/add', icon: '➕' },
  { label: 'Orders & Shipments', href: '/seller/orders', icon: '🚚' },
  { label: 'Sales Analytics', href: '/seller/analytics', icon: '📈' },
  { label: 'Customer Reviews', href: '/seller/reviews', icon: '⭐' },
  { label: 'Payments & Payouts', href: '/seller/payments', icon: '💵' },
  { label: 'Store Settings', href: '/seller/settings', icon: '⚙️' },
];

export const SellerSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#232f3e] text-white flex-shrink-0 min-h-screen p-4 flex flex-col justify-between select-none">
      <div>
        <div className="pb-6 border-b border-gray-700 mb-4 px-2">
          <span className="text-xl font-black tracking-tight text-white block">
            amazon<span className="text-orange-400">seller</span>
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Seller Central India</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition ${
                  isActive
                    ? 'bg-orange-500 text-white font-bold'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-700 text-[11px] text-gray-400 px-2 space-y-1">
        <p>Merchant Account Active</p>
        <Link href="/" className="text-orange-400 hover:underline block">
          ← Back to Marketplace
        </Link>
      </div>
    </aside>
  );
};

export default SellerSidebar;

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { label: 'Overview', href: '/admin/dashboard', icon: '📊' },
  { label: 'Users & Customers', href: '/admin/users', icon: '👥' },
  { label: 'All Products', href: '/admin/products', icon: '📦' },
  { label: 'All Orders', href: '/admin/orders', icon: '🚚' },
  { label: 'Seller Approvals', href: '/admin/sellers', icon: '🏢' },
  { label: 'Coupons & Promos', href: '/admin/coupons', icon: '🎟️' },
  { label: 'Homepage Banners', href: '/admin/banners', icon: '🖼️' },
  { label: 'Categories Master', href: '/admin/categories', icon: '📁' },
  { label: 'Reports & Revenue', href: '/admin/reports', icon: '📈' },
  { label: 'System Settings', href: '/admin/settings', icon: '⚙️' },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#131921] text-white flex-shrink-0 min-h-screen p-4 flex flex-col justify-between select-none">
      <div>
        <div className="pb-6 border-b border-gray-800 mb-4 px-2">
          <span className="text-xl font-black tracking-tight text-white block">
            amazon<span className="text-blue-400">admin</span>
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Platform Administration</span>
        </div>

        <nav className="space-y-1">
          {adminLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
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

      <div className="pt-4 border-t border-gray-800 text-[11px] text-gray-400 px-2 space-y-1">
        <p>Admin Authorization: Level 1</p>
        <Link href="/" className="text-blue-400 hover:underline block">
          ← Exit to Storefront
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

'use client';

import React from 'react';
import { SellerDashboardStats } from '@/types/seller';

interface SellerStatsProps {
  stats: SellerDashboardStats;
}

export const SellerStats: React.FC<SellerStatsProps> = ({ stats }) => {
  const cards = [
    { title: "Today's Revenue", value: `₹${(stats?.revenue30Days || 0).toLocaleString('en-IN')}`, change: '+12.4%', icon: '💵' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, change: 'Requires dispatch', icon: '🚚', alert: stats?.pendingOrders > 0 },
    { title: 'Active Listings', value: stats?.totalProducts || 0, change: 'Live on catalog', icon: '📦' },
    { title: 'Seller Rating', value: `${stats?.sellerRating || 4.8} ★`, change: `${stats?.ratingCount || 0} reviews`, icon: '⭐' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500">{c.title}</span>
            <span className="text-xl">{c.icon}</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{c.value}</p>
          <span className={`text-[11px] font-semibold block ${c.alert ? 'text-amber-600' : 'text-emerald-600'}`}>
            {c.change}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SellerStats;

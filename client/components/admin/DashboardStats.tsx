'use client';

import React from 'react';

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingSellers: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const metrics = [
    { title: 'Total GMV Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰' },
    { title: 'Registered Users', value: stats?.totalUsers || 0, icon: '👥' },
    { title: 'Catalog Products', value: stats?.totalProducts || 0, icon: '📦' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: '🚚' },
    { title: 'Pending Seller Approvals', value: stats?.pendingSellers || 0, icon: '⏳', alert: stats?.pendingSellers > 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-gray-500 text-xs font-bold">
            <span>{m.title}</span>
            <span className="text-lg">{m.icon}</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{m.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

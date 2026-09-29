'use client';

import React from 'react';

export const RevenueChart: React.FC = () => {
  const bars = [
    { day: 'Mon', amount: 45000, height: '40%' },
    { day: 'Tue', amount: 62000, height: '60%' },
    { day: 'Wed', amount: 89000, height: '85%' },
    { day: 'Thu', amount: 54000, height: '50%' },
    { day: 'Fri', amount: 98000, height: '95%' },
    { day: 'Sat', amount: 110000, height: '100%' },
    { day: 'Sun', amount: 75000, height: '70%' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="font-bold text-sm text-gray-900">7-Day Sales Performance</h3>
        <span className="text-xs font-bold text-emerald-600">+18.2% vs Last Week</span>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
        {bars.map((b) => (
          <div key={b.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div
              style={{ height: b.height }}
              className="w-full bg-[#ffa41c] hover:bg-[#ff8f00] rounded-t transition-all cursor-pointer relative group"
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                ₹{b.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium">{b.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;

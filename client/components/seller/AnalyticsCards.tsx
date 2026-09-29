'use client';

import React from 'react';

export const AnalyticsCards: React.FC = () => {
  const metrics = [
    { label: 'Conversion Rate', value: '3.8%', icon: '🎯' },
    { label: 'Cart Abandonment', value: '24.1%', icon: '🛒' },
    { label: 'Average Order Value', value: '₹2,450', icon: '💳' },
    { label: 'Return Rate', value: '1.2%', icon: '🔄' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded p-4 text-xs shadow-sm space-y-1">
          <div className="flex justify-between items-center text-gray-500">
            <span>{m.label}</span>
            <span>{m.icon}</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{m.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;

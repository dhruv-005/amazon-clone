'use client';

import React from 'react';

export const DeliveryInfo: React.FC = () => {
  const badges = [
    { title: '7 days Replacement', icon: '🔄' },
    { title: 'Free Delivery', icon: '🚚' },
    { title: '1 Year Warranty', icon: '🛡️' },
    { title: 'Pay on Delivery', icon: '💵' },
    { title: 'Top Brand', icon: '⭐' },
    { title: 'Amazon Delivered', icon: '📦' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 py-4 border-y border-gray-200 text-center select-none">
      {badges.map((b, i) => (
        <div key={i} className="flex flex-col items-center p-1">
          <span className="text-xl mb-1">{b.icon}</span>
          <span className="text-[11px] text-[#007185] leading-tight font-medium">
            {b.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DeliveryInfo;

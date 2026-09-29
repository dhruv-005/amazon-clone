'use client';

import React, { useState } from 'react';

export const DeliveryOptions: React.FC = () => {
  const [selectedSpeed, setSelectedSpeed] = useState('standard');

  return (
    <div className="space-y-3 pt-2 text-xs">
      <h4 className="font-bold text-gray-900">Choose a delivery speed:</h4>

      <label className="flex items-start gap-2.5 p-3 border border-emerald-300 bg-emerald-50/50 rounded cursor-pointer">
        <input
          type="radio"
          name="delivery_speed"
          checked={selectedSpeed === 'standard'}
          onChange={() => setSelectedSpeed('standard')}
          className="mt-0.5 text-orange-500 focus:ring-orange-400"
        />
        <div>
          <span className="font-bold text-[#007600] block">
            Tomorrow by 9 PM — FREE Delivery with Prime
          </span>
          <span className="text-gray-500 text-[11px]">
            Standard Amazon Express Delivery
          </span>
        </div>
      </label>
    </div>
  );
};

export default DeliveryOptions;

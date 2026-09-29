'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setGiftOptions } from '@/store/slices/checkoutSlice';

export const GiftOptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isGift, giftMessage } = useAppSelector((state) => state.checkout);

  return (
    <div className="border border-gray-200 rounded p-3 bg-gray-50 text-xs space-y-2">
      <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 select-none">
        <input
          type="checkbox"
          checked={isGift}
          onChange={(e) =>
            dispatch(setGiftOptions({ isGift: e.target.checked, giftMessage }))
          }
          className="rounded text-orange-500 focus:ring-orange-400"
        />
        <span>Gift options</span>
      </label>

      {isGift && (
        <textarea
          placeholder="Enter custom gift message (optional)..."
          value={giftMessage || ''}
          onChange={(e) =>
            dispatch(setGiftOptions({ isGift: true, giftMessage: e.target.value }))
          }
          className="w-full bg-white border border-gray-300 rounded p-2 text-xs outline-none focus:border-orange-500"
          rows={2}
        />
      )}
    </div>
  );
};

export default GiftOptions;

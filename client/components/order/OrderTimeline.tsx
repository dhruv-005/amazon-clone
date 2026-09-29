'use client';

import React from 'react';
import { OrderStatus } from '@/types/order';

interface OrderTimelineProps {
  status: OrderStatus;
  updates?: Array<{ status: string; description?: string; timestamp: string; location?: string }>;
}

const steps: Array<{ key: OrderStatus; title: string }> = [
  { key: 'placed', title: 'Ordered' },
  { key: 'confirmed', title: 'Confirmed' },
  { key: 'shipped', title: 'Shipped' },
  { key: 'out_for_delivery', title: 'Out for delivery' },
  { key: 'delivered', title: 'Delivered' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, updates = [] }) => {
  const isCancelled = status === 'cancelled';
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 space-y-6 text-xs">
      <h3 className="text-sm font-bold text-gray-900">Delivery Status</h3>

      {isCancelled ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 font-bold">
          ✕ This order has been cancelled.
        </div>
      ) : (
        /* Stepper Bar */
        <div className="relative flex justify-between items-center max-w-2xl mx-auto my-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#007600] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }}
          />

          {steps.map((s, idx) => {
            const isDone = currentIndex >= idx;

            return (
              <div key={s.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    isDone ? 'bg-[#007600] text-white ring-4 ring-emerald-50' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={`mt-2 font-medium text-[11px] ${isDone ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Real-time Tracking History Log */}
      {updates.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
          <h4 className="font-bold text-gray-900">Activity History</h4>
          <ul className="space-y-2 text-gray-700">
            {updates.map((u, i) => (
              <li key={i} className="flex gap-3 text-[11px]">
                <span className="text-gray-400 min-w-[120px]">
                  {new Date(u.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                <div>
                  <strong className="text-gray-900">{u.status}</strong>
                  {u.location && <span> — {u.location}</span>}
                  {u.description && <p className="text-gray-500">{u.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;

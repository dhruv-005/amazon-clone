'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';

interface CancelOrderProps {
  onConfirmCancel: (reason: string) => void;
  onClose: () => void;
}

const cancelReasons = [
  'Order created by mistake',
  'Item price is too high',
  'Need to change shipping address',
  'Need to change payment method',
  'Delivery time is too long',
  'Other',
];

export const CancelOrder: React.FC<CancelOrderProps> = ({
  onConfirmCancel,
  onClose,
}) => {
  const [reason, setReason] = useState(cancelReasons[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCancel(reason);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs text-gray-800">
      <h3 className="text-base font-bold text-gray-900">Are you sure you want to cancel this order?</h3>
      <p className="text-gray-600">
        Items will not be shipped and the order will be permanently stopped.
      </p>

      <div>
        <label className="font-bold block mb-1">Reason for cancellation</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-[#f0f2f2] border border-gray-300 rounded p-2 outline-none"
        >
          {cancelReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Don't Cancel
        </Button>
        <Button type="submit" variant="danger">
          Confirm Cancellation
        </Button>
      </div>
    </form>
  );
};

export default CancelOrder;

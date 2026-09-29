'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';

interface ReturnFormProps {
  orderId: string;
  onSubmitReturn: (reason: string, notes: string) => void;
  onCancel: () => void;
}

const returnReasons = [
  'Item defective or doesn’t work',
  'Wrong item sent',
  'Item arrived damaged',
  'Product and shipping box both damaged',
  'Missing parts or accessories',
  'No longer needed',
];

export const ReturnForm: React.FC<ReturnFormProps> = ({
  onSubmitReturn,
  onCancel,
}) => {
  const [reason, setReason] = useState(returnReasons[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReturn(reason, notes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs text-gray-800">
      <h3 className="text-base font-bold text-gray-900">Why are you returning this?</h3>

      <div>
        <label className="font-bold block mb-1">Select a reason</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-[#f0f2f2] border border-gray-300 rounded p-2 font-medium outline-none focus:ring-2 focus:ring-orange-400"
        >
          {returnReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-bold block mb-1">Comments (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Please provide details about the issue"
          rows={3}
          className="w-full border border-gray-300 rounded p-2 outline-none focus:border-orange-500"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit Return Request
        </Button>
      </div>
    </form>
  );
};

export default ReturnForm;

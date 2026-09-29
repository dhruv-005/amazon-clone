'use client';

import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CouponFormProps {
  onSubmit: (data: any) => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({ onSubmit }) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(499);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code: code.toUpperCase(),
      description,
      type: 'percentage',
      value: Number(value),
      minPurchase: Number(minPurchase),
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 text-xs max-w-lg">
      <h3 className="font-bold text-sm text-gray-900">Create New Promo Coupon</h3>
      <Input label="Coupon Code" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SAVE20" />
      <Input label="Description" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Get 20% off on all items" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Discount Percentage (%)" type="number" required value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <Input label="Minimum Purchase (₹)" type="number" required value={minPurchase} onChange={(e) => setMinPurchase(Number(e.target.value))} />
      </div>
      <Button type="submit" variant="primary">Create Coupon</Button>
    </form>
  );
};

export default CouponForm;

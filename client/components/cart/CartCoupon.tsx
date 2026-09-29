'use client';

import React, { useState } from 'react';
import { useApplyCouponMutation } from '@/store/api/cartApi';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const CartCoupon: React.FC = () => {
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await applyCoupon({ code: code.trim() }).unwrap();
      setAppliedCode(code.trim().toUpperCase());
      alert(`Coupon '${code.toUpperCase()}' applied successfully!`);
    } catch (err: any) {
      alert(err?.data?.message || 'Invalid or expired coupon code');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-xs">
      <h3 className="font-bold text-gray-900 mb-2">Apply Promotional Code</h3>
      <form onSubmit={handleApply} className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="uppercase tracking-wider font-bold"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          isLoading={isLoading}
          disabled={!code.trim()}
        >
          Apply
        </Button>
      </form>
      {appliedCode && (
        <p className="text-emerald-700 font-bold mt-2">
          ✓ Coupon <strong>{appliedCode}</strong> active
        </p>
      )}
    </div>
  );
};

export default CartCoupon;

'use client';

import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCheckoutStep } from '@/store/slices/checkoutSlice';
import Button from '../ui/Button';

export const PaymentStep: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
        2. Payment Method
      </h2>

      <div className="p-4 border-2 border-orange-500 bg-orange-50/30 rounded-md space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="payment_method"
            checked
            readOnly
            className="text-orange-500 focus:ring-orange-400"
          />
          <div>
            <span className="font-bold text-sm text-gray-900 block">
              Cash on Delivery (COD) / Pay on Delivery
            </span>
            <span className="text-xs text-gray-600">
              Pay with Cash, UPI, or Cards to the delivery agent upon package arrival.
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button variant="primary" onClick={() => dispatch(setCheckoutStep(3))}>
          Use this payment method
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;

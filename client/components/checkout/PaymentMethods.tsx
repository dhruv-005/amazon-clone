'use client';

import React from 'react';

export const PaymentMethods: React.FC = () => {
  return (
    <div className="text-xs text-gray-600 space-y-1">
      <p className="font-semibold text-gray-800">Supported at your doorstep:</p>
      <ul className="list-disc pl-5 space-y-0.5">
        <li>Cash Currency Notes</li>
        <li>Doorstep UPI Scan & Pay (GPay / PhonePe / Paytm)</li>
        <li>Credit & Debit Cards via mPOS reader</li>
      </ul>
    </div>
  );
};

export default PaymentMethods;

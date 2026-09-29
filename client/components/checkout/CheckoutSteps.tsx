'use client';

import React from 'react';

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { step: 1, title: 'Delivery Address' },
  { step: 2, title: 'Payment Method (COD)' },
  { step: 3, title: 'Items & Delivery' },
];

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-6 py-4 border-b border-gray-200 bg-white text-xs sm:text-sm font-medium select-none">
      {steps.map((item, idx) => {
        const isCurrent = currentStep === item.step;
        const isCompleted = currentStep > item.step;

        return (
          <React.Fragment key={item.step}>
            {idx > 0 && <span className="text-gray-300 font-bold">›</span>}
            <div
              className={`flex items-center gap-1.5 ${
                isCurrent
                  ? 'text-[#c45500] font-bold'
                  : isCompleted
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-[#c45500] text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : item.step}
              </span>
              <span>{item.title}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;

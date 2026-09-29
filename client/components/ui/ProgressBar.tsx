'use client';

import React from 'react';

export interface ProgressBarProps {
  percent: number;
  label?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  label,
  color = 'bg-[#ffa41c]',
}) => {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full flex items-center gap-3">
      {label && <span className="text-xs text-gray-600 font-medium min-w-[40px]">{label}</span>}
      <div className="flex-1 bg-[#f0f2f2] border border-gray-300 rounded-sm h-4 overflow-hidden">
        <div
          style={{ width: `${safePercent}%` }}
          className={`h-full transition-all duration-300 ${color}`}
        />
      </div>
      <span className="text-xs text-[#007185] font-normal min-w-[32px] text-right">
        {safePercent}%
      </span>
    </div>
  );
};

export default ProgressBar;

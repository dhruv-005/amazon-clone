'use client';

import React from 'react';

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
      <h3 className="font-bold text-sm text-gray-900">Platform Gross Merchandise Volume (GMV)</h3>
      <div className="h-48 bg-slate-50 border border-dashed rounded flex items-center justify-center text-xs text-gray-400">
        Monthly Revenue Timeline Visualizer Active
      </div>
    </div>
  );
};

export default RevenueChart;

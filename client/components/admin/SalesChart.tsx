'use client';

import React from 'react';

export const SalesChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
      <h3 className="font-bold text-sm text-gray-900">Order Volume by Category</h3>
      <div className="h-48 bg-slate-50 border border-dashed rounded flex items-center justify-center text-xs text-gray-400">
        Category Volume Share: Electronics (45%) | Fashion (28%) | Home (15%) | Books (12%)
      </div>
    </div>
  );
};

export default SalesChart;

'use client';

import React from 'react';
import Rating from '../ui/Rating';

export const ReviewsList: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3 text-xs">
      <h3 className="font-bold text-sm text-gray-900 border-b pb-2">Recent Buyer Feedback</h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Rating value={5} size="sm" showCount={false} />
            <span className="font-bold text-gray-900">Fast delivery and authentic product!</span>
          </div>
          <p className="text-gray-600">Delivered within 24 hours. Packaging was pristine.</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;

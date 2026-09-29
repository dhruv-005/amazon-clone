'use client';

import React from 'react';

interface RatingFilterProps {
  selectedRating?: number;
  onSelectRating: (rating?: number) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  selectedRating,
  onSelectRating,
}) => {
  const stars = [4, 3, 2, 1];

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4 select-none">
      <h3 className="font-bold text-sm text-gray-900">Customer Reviews</h3>
      <div className="space-y-1">
        {stars.map((star) => {
          const isSelected = selectedRating === star;

          return (
            <button
              key={star}
              onClick={() => onSelectRating(isSelected ? undefined : star)}
              className={`flex items-center gap-1.5 w-full text-left py-0.5 hover:text-orange-600 group ${
                isSelected ? 'font-bold text-orange-700' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-4 h-4 fill-current ${
                      s <= star ? 'text-amber-500' : 'text-gray-300'
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs group-hover:underline">& Up</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RatingFilter;

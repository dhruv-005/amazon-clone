'use client';

import React from 'react';

export interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  interactive?: boolean;
  onChange?: (val: number) => void;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  count,
  size = 'md',
  showCount = true,
  interactive = false,
  onChange,
}) => {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = value >= star;
          const isHalf = value >= star - 0.5 && value < star;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'} text-amber-500`}
            >
              <svg
                className={`${starSizes[size]} fill-current`}
                viewBox="0 0 24 24"
              >
                {isFilled ? (
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                ) : isHalf ? (
                  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                ) : (
                  <path
                    className="text-gray-300"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                )}
              </svg>
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer font-normal">
          {count.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default Rating;

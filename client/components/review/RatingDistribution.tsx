'use client';

import React from 'react';
import ProgressBar from '../ui/ProgressBar';

interface RatingDistributionProps {
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  totalCount: number;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalCount,
}) => {
  return (
    <div className="space-y-2 select-none">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star as keyof typeof distribution] || 0;
        const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

        return (
          <ProgressBar key={star} percent={percent} label={`${star} star`} />
        );
      })}
    </div>
  );
};

export default RatingDistribution;

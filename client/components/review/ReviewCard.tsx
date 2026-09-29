'use client';

import React from 'react';
import { Review } from '@/types/review';
import Rating from '../ui/Rating';
import HelpfulVote from './HelpfulVote';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="space-y-2 border-b border-gray-200 pb-5 text-xs text-gray-800">
      {/* Author Info */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
          {review.user?.name?.[0] || 'A'}
        </div>
        <span className="font-bold text-gray-900">{review.user?.name || 'Amazon Customer'}</span>
      </div>

      {/* Stars & Title */}
      <div className="flex items-center gap-2">
        <Rating value={review.rating} size="sm" showCount={false} />
        {review.title && <span className="font-bold text-gray-900 text-sm">{review.title}</span>}
      </div>

      {/* Review Date & Country */}
      <p className="text-[11px] text-gray-500">
        Reviewed in India on {new Date(review.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
      </p>

      {/* Verified Badge */}
      {review.isVerifiedPurchase && (
        <span className="text-[11px] text-[#c45500] font-bold block">Verified Purchase</span>
      )}

      {/* Comment Body */}
      <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">{review.comment}</p>

      {/* Helpful Vote Widget */}
      <HelpfulVote reviewId={review._id} initialHelpful={review.helpfulVotes} />
    </div>
  );
};

export default ReviewCard;

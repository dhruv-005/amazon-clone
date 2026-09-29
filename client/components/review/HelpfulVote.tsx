'use client';

import React, { useState } from 'react';
import { useMarkHelpfulMutation } from '@/store/api/reviewApi';

interface HelpfulVoteProps {
  reviewId: string;
  initialHelpful?: number;
}

export const HelpfulVote: React.FC<HelpfulVoteProps> = ({ reviewId, initialHelpful = 0 }) => {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [hasVoted, setHasVoted] = useState(false);
  const [markHelpfulApi] = useMarkHelpfulMutation();

  const handleVote = async () => {
    if (hasVoted) return;
    try {
      await markHelpfulApi(reviewId).unwrap();
      setHelpfulCount((prev) => prev + 1);
      setHasVoted(true);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 pt-2 text-xs text-gray-500 select-none">
      {helpfulCount > 0 && <span>{helpfulCount} people found this helpful</span>}
      <button
        onClick={handleVote}
        disabled={hasVoted}
        className={`px-3 py-1 border rounded-full font-medium transition ${
          hasVoted ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 shadow-sm'
        }`}
      >
        {hasVoted ? '✓ Helpful' : 'Helpful'}
      </button>
    </div>
  );
};

export default HelpfulVote;

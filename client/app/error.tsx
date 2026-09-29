'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none">
      <h1 className="text-3xl font-black text-gray-900 mb-2">
        amazon<span className="text-orange-500">.in</span>
      </h1>
      <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Something went wrong on our end
      </h2>
      <p className="text-xs text-gray-500 max-w-md mb-6">
        We apologize for the inconvenience. Please try refreshing or click below to retry.
      </p>
      <button
        onClick={() => reset()}
        className="bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs px-8 py-2.5 rounded-full border border-[#fcd200] shadow-sm"
      >
        Try Again
      </button>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function PrimeSection() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 my-8">
      <div className="bg-gradient-to-r from-[#002f6c] via-[#00a8e1] to-[#002f6c] text-white p-6 sm:p-10 rounded-md shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-block bg-white text-[#002f6c] font-black text-xs px-2.5 py-1 rounded-sm tracking-tight mb-1">
            PRIME MEMBERSHIP
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Fast, FREE delivery, popular movies & exclusive deal access
          </h2>
          <p className="text-sm text-blue-100">
            Join Prime for only ₹129/month or ₹1,499/year. Unlimited 1-day delivery on over 4 million items.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/prime"
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black font-bold text-sm px-8 py-3 rounded-full shadow-lg border border-[#fcd200] transition transform hover:scale-105"
          >
            Join Prime Today
          </Link>
          <Link
            href="/deals"
            className="text-white hover:underline text-xs font-semibold py-2 px-4"
          >
            View Prime Deals →
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="border-b pb-3 flex justify-between items-center">
        <div>
          <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">Amazon Seller Central</span>
          <h1 className="text-2xl font-bold text-gray-900">Seller Payouts & Balance</h1>
        </div>
        <Link href="/" className="text-xs text-[#007185] hover:underline font-semibold">← Back to Store</Link>
      </div>
      <div className="bg-white border rounded-lg p-6 shadow-sm text-xs text-gray-700">
        <p>Merchant workspace is operational.</p>
      </div>
    </div>
  );
}

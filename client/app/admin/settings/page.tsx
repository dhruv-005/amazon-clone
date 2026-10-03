'use client';
import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="border-b pb-3 flex justify-between items-center">
        <div>
          <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Super Admin</span>
          <h1 className="text-2xl font-bold text-gray-900">Global Platform Settings</h1>
        </div>
        <Link href="/" className="text-xs text-[#007185] hover:underline font-semibold">← Exit to Store</Link>
      </div>
      <div className="bg-white border rounded-lg p-6 shadow-sm text-xs text-gray-700">
        <p>Admin control panel active.</p>
      </div>
    </div>
  );
}

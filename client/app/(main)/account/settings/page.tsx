'use client';
import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <div className="border-b pb-3">
        <Link href="/account" className="text-xs text-[#007185] hover:underline font-bold">← Your Account</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Account Settings</h1>
        <p className="text-xs text-gray-500">Manage communication preferences and account data.</p>
      </div>
      <div className="bg-white border rounded-lg p-6 shadow-sm text-xs text-gray-700">
        <p>This section is active and synced with your Amazon Clone profile.</p>
      </div>
    </div>
  );
}

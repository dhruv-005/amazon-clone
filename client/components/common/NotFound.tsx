'use client';

import React from 'react';
import Link from 'next/link';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <h1 className="text-6xl font-black text-orange-500">404</h1>
      <h2 className="text-2xl font-bold text-gray-900">Looking for something?</h2>
      <p className="text-xs text-gray-600 max-w-md">
        We're sorry. The Web address you entered is not a functioning page on our site.
      </p>
      <Link
        href="/"
        className="bg-[#ffd814] hover:bg-[#f7ca00] text-black font-semibold text-xs px-8 py-2.5 rounded-full border border-[#fcd200] shadow-sm inline-block"
      >
        Go to Amazon Clone's Home Page
      </Link>
    </div>
  );
};

export default NotFound;

'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between items-center py-6 px-4">
      {/* Amazon Logo Header */}
      <div className="mb-4">
        <Link href="/" className="inline-block">
          <span className="text-3xl font-black tracking-tight text-gray-900">
            amazon<span className="text-orange-500 font-bold text-sm">.in</span>
          </span>
        </Link>
      </div>

      {/* Main White Auth Box */}
      <div className="w-full max-w-[350px] bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        {children}
      </div>

      {/* Footer Legal Strip */}
      <div className="w-full max-w-[350px] text-center pt-8 border-t border-gray-200 mt-6 text-[11px] text-gray-600 space-y-2">
        <div className="flex justify-center space-x-4">
          <Link href="/terms" className="text-[#007185] hover:underline">Conditions of Use</Link>
          <Link href="/privacy" className="text-[#007185] hover:underline">Privacy Notice</Link>
          <Link href="/help" className="text-[#007185] hover:underline">Help</Link>
        </div>
        <p>&copy; 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
      </div>
    </div>
  );
};

export default AuthLayout;

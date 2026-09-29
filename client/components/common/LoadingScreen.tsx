'use client';

import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm select-none">
      <div className="text-3xl font-black tracking-tight text-gray-900 mb-4 animate-pulse">
        amazon<span className="text-orange-500 font-bold text-lg">.in</span>
      </div>
      <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default LoadingScreen;

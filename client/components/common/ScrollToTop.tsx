'use client';

import React, { useState, useEffect } from 'react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 bg-[#37475a] hover:bg-[#485769] text-white p-3 rounded-full shadow-xl transition border border-gray-600"
      aria-label="Scroll to top"
    >
      ▲
    </button>
  );
};

export default ScrollToTop;

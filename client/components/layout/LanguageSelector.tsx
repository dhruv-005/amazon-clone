'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage } from '@/store/slices/uiSlice';

const languages = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिन्दी', native: 'HI' },
  { code: 'ta', label: 'தமிழ்', native: 'TA' },
  { code: 'te', label: 'తెలుగు', native: 'TE' },
  { code: 'kn', label: 'ಕನ್ನಡ', native: 'KN' },
  { code: 'ml', label: 'മലയാളം', native: 'ML' },
  { code: 'bn', label: 'বাংলা', native: 'BN' },
  { code: 'mr', label: 'मराठी', native: 'MR' },
];

export const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.ui.currentLanguage);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm transition-colors text-white text-xs font-bold">
        {/* Indian Flag SVG */}
        <span className="text-sm">🇮🇳</span>
        <span className="uppercase">{currentLang}</span>
        <svg className="w-2.5 h-2.5 text-gray-400 fill-current" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {/* Flyout */}
      {isHovered && (
        <div className="absolute left-0 top-full mt-0 w-48 bg-white text-gray-900 rounded shadow-xl border border-gray-200 z-50 p-3 text-xs animate-scaleUp">
          <p className="font-bold mb-2 text-gray-700">Change language</p>
          <div className="space-y-2">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className="flex items-center gap-2 cursor-pointer hover:text-orange-600"
              >
                <input
                  type="radio"
                  name="lang"
                  checked={currentLang === lang.code}
                  onChange={() => dispatch(setLanguage(lang.code))}
                  className="text-orange-500 focus:ring-orange-400"
                />
                <span>{lang.label} - {lang.native}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

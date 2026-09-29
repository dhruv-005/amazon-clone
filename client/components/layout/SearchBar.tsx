'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCategoriesQuery } from '@/store/api/productApi';
import { useGetSearchSuggestionsQuery } from '@/store/api/searchApi';

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoryData } = useGetCategoriesQuery();
  const { data: suggestionData } = useGetSearchSuggestionsQuery(query, {
    skip: query.trim().length < 2,
  });

  const categories = categoryData?.data?.categories || [];
  const suggestions = suggestionData?.data?.suggestions || [];

  const handleSearch = (searchTerm?: string) => {
    const q = searchTerm !== undefined ? searchTerm : query;
    if (q.trim()) {
      setIsFocused(false);
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      router.push(`/search?q=${encodeURIComponent(q.trim())}${categoryParam}`);
    }
  };

  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.start();

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      alert('Voice search is not supported in this browser.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className={`flex items-center h-10 rounded-md bg-white overflow-hidden ${
          isFocused ? 'ring-3 ring-[#f3a847] shadow-[0_0_0_2px_#f3a847]' : ''
        }`}
      >
        {/* Category Dropdown */}
        <div className="h-full bg-[#f3f3f3] hover:bg-[#dadada] border-r border-gray-300 flex items-center px-2 cursor-pointer transition">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs text-gray-800 font-normal outline-none cursor-pointer max-w-[90px] sm:max-w-[130px] truncate"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <div className="flex-1 relative h-full flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search Amazon.in"
            className="w-full h-full px-3 text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-700 p-1 mr-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          title="Search with your voice"
          className={`px-2.5 h-full flex items-center justify-center text-gray-500 hover:text-black ${
            isListening ? 'text-red-600 animate-pulse' : ''
          }`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="bg-[#febd69] hover:bg-[#f3a847] text-[#131921] h-full px-4 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-b shadow-xl z-50 overflow-hidden">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onMouseDown={() => {
                setQuery(item.title);
                handleSearch(item.title);
              }}
              className="px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between text-sm text-gray-800 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-400 fill-current" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <span className="font-semibold">{item.title}</span>
              </div>
              {item.category && (
                <span className="text-xs text-gray-400">in {item.category}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

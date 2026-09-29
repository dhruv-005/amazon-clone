'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const executeSearch = (searchQuery?: string, searchCategory?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    const cat = searchCategory !== undefined ? searchCategory : category;

    if (q.trim()) {
      const catParam = cat !== 'all' ? `&category=${cat}` : '';
      router.push(`/search?q=${encodeURIComponent(q.trim())}${catParam}`);
    }
  };

  return {
    query,
    setQuery,
    category,
    setCategory,
    executeSearch,
  };
};

export default useSearch;

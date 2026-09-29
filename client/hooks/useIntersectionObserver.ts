'use client';

import { useState, useEffect, RefObject } from 'react';

export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  { threshold = 0.1, root = null, rootMargin = '0%' } = {}
): IntersectionObserverEntry | null => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef?.current;
    if (!node || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin]);

  return entry;
};

export default useIntersectionObserver;

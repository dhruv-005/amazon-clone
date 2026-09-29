'use client';

import React from 'react';
import Link from 'next/link';

interface ProductBreadcrumbProps {
  category?: { name: string; slug: string };
  title: string;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ category, title }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-500 py-2 truncate">
      <Link href="/" className="hover:text-orange-600 hover:underline">
        Home
      </Link>
      {category && (
        <>
          <span>›</span>
          <Link href={`/category/${category.slug}`} className="hover:text-orange-600 hover:underline">
            {category.name}
          </Link>
        </>
      )}
      <span>›</span>
      <span className="text-gray-700 truncate max-w-xs">{title}</span>
    </nav>
  );
};

export default ProductBreadcrumb;

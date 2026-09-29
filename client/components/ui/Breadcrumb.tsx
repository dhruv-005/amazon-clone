'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-500 py-2 overflow-x-auto">
      <Link href="/" className="hover:text-orange-600 hover:underline">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-400">›</span>
          {item.href && index < items.length - 1 ? (
            <Link href={item.href} className="hover:text-orange-600 hover:underline whitespace-nowrap">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium whitespace-nowrap">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

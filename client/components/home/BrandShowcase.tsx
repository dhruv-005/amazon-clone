'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const brands = [
  { name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200', href: '/products?brand=apple' },
  { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200', href: '/products?brand=samsung' },
  { name: 'Sony', logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200', href: '/products?brand=sony' },
  { name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', href: '/category/fashion' },
  { name: 'boAt', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', href: '/products?brand=boat' },
  { name: 'Dell', logo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200', href: '/category/computers-accessories' },
];

export default function BrandShowcase() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 my-6">
      <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Official Brand Stores</h2>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:border-orange-500 hover:shadow-md transition bg-gray-50/50 group"
            >
              <div className="relative h-16 w-16 mb-2 rounded-full overflow-hidden bg-white p-1 shadow-sm">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                  sizes="64px"
                />
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

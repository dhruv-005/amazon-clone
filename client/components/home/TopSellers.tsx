'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const sellerSpotlights = [
  {
    storeName: 'Appario Retail Private Ltd',
    tagline: 'Electronics, Smartphones & Accessories',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500',
    link: '/products?brand=apple',
  },
  {
    storeName: 'Cloudtail Fashion Store',
    tagline: 'Authentic Footwear, Watches & Apparel',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
    link: '/category/fashion',
  },
  {
    storeName: 'Cocoblu Books Emporium',
    tagline: 'Millions of Best Selling Hardcovers & Paperbacks',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500',
    link: '/category/books',
  },
];

export default function TopSellers() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 my-6">
      <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Verified Sellers on Amazon</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sellerSpotlights.map((seller, idx) => (
            <Link
              key={idx}
              href={seller.link}
              className="group border border-gray-200 rounded overflow-hidden hover:shadow-lg transition flex flex-col"
            >
              <div className="relative h-44 w-full bg-gray-100">
                <Image
                  src={seller.image}
                  alt={seller.storeName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600">
                      {seller.storeName}
                    </h3>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      ⭐ {seller.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{seller.tagline}</p>
                </div>
                <span className="text-xs text-[#007185] font-semibold mt-3 block">
                  Visit Storefront →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

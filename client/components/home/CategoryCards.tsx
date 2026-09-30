'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const cardData = [
  {
    title: 'Appliances for your home | Up to 55% off',
    linkText: 'See more offers',
    href: '/category/home-kitchen',
    items: [
      { name: 'Air conditioners', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', href: '/category/home-kitchen' },
      { name: 'Refrigerators', imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300', href: '/category/home-kitchen' },
      { name: 'Microwaves', imageUrl: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=300', href: '/category/home-kitchen' },
      { name: 'Washing machines', imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300', href: '/category/home-kitchen' },
    ],
  },
  {
    title: 'Up to 60% off | Styles for men',
    linkText: 'End of season sale',
    href: '/category/fashion',
    items: [
      { name: 'Clothing', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300', href: '/category/fashion' },
      { name: 'Footwear', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', href: '/category/fashion' },
      { name: 'Watches', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300', href: '/category/fashion' },
      { name: 'Bags & luggage', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', href: '/category/fashion' },
    ],
  },
  {
    title: 'Revamp your home in style',
    linkText: 'Explore all decor',
    href: '/category/home-kitchen',
    items: [
      { name: 'Cushion covers, bedsheets', imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300', href: '/category/home-kitchen' },
      { name: 'Figurines, vases & more', imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300', href: '/category/home-kitchen' },
      { name: 'Home storage', imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300', href: '/category/home-kitchen' },
      { name: 'Lighting solutions', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300', href: '/category/home-kitchen' },
    ],
  },
  {
    title: 'Starting ₹99 | All your electronics needs',
    linkText: 'See all electronic accessories',
    href: '/category/electronics',
    items: [
      { name: 'Laptop accessories', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300', href: '/category/computers-accessories' },
      { name: 'Headphones & audio', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', href: '/category/electronics' },
      { name: 'Power banks & cables', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300', href: '/category/electronics' },
      { name: 'Smartwatches', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', href: '/category/electronics' },
    ],
  },
];

export default function CategoryCards() {
  return (
    <div className="relative z-30 max-w-[1500px] mx-auto px-4 -mt-16 sm:-mt-32 md:-mt-48 lg:-mt-64 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="bg-white p-5 border border-gray-200 shadow-md flex flex-col justify-between rounded-sm"
        >
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-3">
              {card.title}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {card.items.map((item, i) => (
                <Link key={i} href={item.href} className="group flex flex-col cursor-pointer">
                  <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-gray-100 rounded-sm mb-1">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <span className="text-[11px] text-gray-700 leading-snug group-hover:text-orange-700">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link
            href={card.href}
            className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium inline-block"
          >
            {card.linkText}
          </Link>
        </div>
      ))}
    </div>
  );
}

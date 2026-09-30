'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetDealProductsQuery } from '@/store/api/productApi';

export default function DealsCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: dealsData, isLoading } = useGetDealProductsQuery();
  const products = dealsData?.data?.products || [];

  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading || products.length === 0) return null;

  return (
    <div className="max-w-[1500px] mx-auto px-4 my-6">
      <div className="bg-white p-5 border border-gray-200 shadow-sm rounded-sm relative group">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Today's Deals</h2>
            <Link href="/deals" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium">
              See all deals
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full font-bold">
            <span>⚡ Ends in:</span>
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-md border border-gray-300 p-2.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5 text-gray-800 fill-current" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-md border border-gray-300 p-2.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5 text-gray-800 fill-current" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {products.map((product) => {
            const discount =
              product.dealInfo?.dealPrice && product.price?.original
                ? Math.round(((product.price.original - product.dealInfo.dealPrice) / product.price.original) * 100)
                : product.price?.discount || 20;

            const finalPrice = product.dealInfo?.dealPrice || product.price?.current || 0;

            return (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="flex-shrink-0 w-48 sm:w-56 p-2 rounded hover:bg-gray-50 transition cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-white flex items-center justify-center p-2 mb-2">
                  <Image
                    src={product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-contain p-2"
                    sizes="224px"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                      Up to {discount}% off
                    </span>
                    <span className="text-[11px] text-[#cc0c39] font-bold">Limited time deal</span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                    {product.price?.original > finalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        M.R.P: ₹{product.price.original.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 truncate mt-1">{product.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

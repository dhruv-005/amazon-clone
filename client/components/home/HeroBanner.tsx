'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const bannerSlides = [
  {
    id: 1,
    title: 'Great Republic Day Deals',
    subtitle: 'Up to 75% off on Electronics, Laptops & Home Essentials',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
    link: '/deals',
  },
  {
    id: 2,
    title: 'Upgrade to iPhone 15 Today',
    subtitle: 'Starting from ₹71,290 with No Cost EMI & Exchange Offers',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1920&q=80',
    link: '/products',
  },
  {
    id: 3,
    title: 'Premium Audio & Noise Cancelling Headphones',
    subtitle: 'Immerse in crystal clear sound with Sony, boAt & Bose',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1920&q=80',
    link: '/category/electronics',
  },
  {
    id: 4,
    title: 'Transform Your Home & Kitchen',
    subtitle: 'Cookware, modern appliances & luxury furniture starting at ₹299',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&q=80',
    link: '/category/home-kitchen',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-[1500px] mx-auto overflow-hidden select-none">
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Link href={slide.link} className="block w-full h-full relative">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-top"
                sizes="(max-width: 1500px) 100vw, 1500px"
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-64 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent z-20 pointer-events-none" />

      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute top-1/4 sm:top-1/3 left-2 z-30 p-2 sm:p-3 text-white/80 hover:text-white hover:bg-black/20 border-2 border-transparent focus:border-white rounded outline-none transition"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-current drop-shadow-md" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute top-1/4 sm:top-1/3 right-2 z-30 p-2 sm:p-3 text-white/80 hover:text-white hover:bg-black/20 border-2 border-transparent focus:border-white rounded outline-none transition"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10 fill-current drop-shadow-md" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>
    </div>
  );
}

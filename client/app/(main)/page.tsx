'use client';

import React from 'react';
import {
  HeroBanner,
  CategoryCards,
  DealsCarousel,
  RecommendedProducts,
  PrimeSection,
  TrendingProducts,
  BrandShowcase,
  TopSellers,
  RecentlyViewed,
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="space-y-6 pb-12">
      <HeroBanner />
      <CategoryCards />
      <DealsCarousel />
      <RecommendedProducts />
      <PrimeSection />
      <TrendingProducts />
      <BrandShowcase />
      <TopSellers />
      <RecentlyViewed />
    </div>
  );
}

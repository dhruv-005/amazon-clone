import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryCards from '@/components/home/CategoryCards';
import DealsCarousel from '@/components/home/DealsCarousel';
import RecommendedProducts from '@/components/home/RecommendedProducts';
import TrendingProducts from '@/components/home/TrendingProducts';
import TopSellers from '@/components/home/TopSellers';
import BrandShowcase from '@/components/home/BrandShowcase';
import PrimeSection from '@/components/home/PrimeSection';
import RecentlyViewed from '@/components/home/RecentlyViewed';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* 1. Auto-sliding Hero Carousel */}
      <HeroBanner />

      {/* 2. Overlapping 4-Card Category Grids */}
      <CategoryCards />

      {/* 3. Lightning Deals with Countdown */}
      <DealsCarousel />

      {/* 4. Personalized Recommended Products Row */}
      <RecommendedProducts />

      {/* 5. Prime Benefits Section */}
      <PrimeSection />

      {/* 6. Trending Bestsellers Row */}
      <TrendingProducts />

      {/* 7. Official Brand Stores Showcase */}
      <BrandShowcase />

      {/* 8. Verified Top Sellers Spotlight */}
      <TopSellers />

      {/* 9. User Browsing History */}
      <RecentlyViewed />
    </div>
  );
}

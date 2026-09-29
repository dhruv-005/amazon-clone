'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import Rating from '../ui/Rating';
import PriceDisplay from './PriceDisplay';
import OfferSection from './OfferSection';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div className="space-y-4 divide-y divide-gray-200">
      {/* Title & Brand Header */}
      <div>
        {product.brand && (
          <Link
            href={`/search?brand=${encodeURIComponent(product.brand.name || '')}`}
            className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium"
          >
            Visit the {product.brand.name || product.brandName} Store
          </Link>
        )}
        <h1 className="text-xl sm:text-2xl font-medium text-gray-900 leading-tight mt-1">
          {product.title}
        </h1>

        {/* Ratings & Question Answers Header */}
        <div className="flex items-center gap-3 mt-2 text-xs">
          <Rating value={product.ratings?.average || 0} count={product.ratings?.count || 0} size="sm" />
          <span className="text-gray-300">|</span>
          <a href="#customer-qa" className="text-[#007185] hover:text-[#c45500] hover:underline">
            100+ answered questions
          </a>
        </div>
      </div>

      {/* Pricing & Offers */}
      <div className="pt-3 space-y-3">
        <PriceDisplay
          current={product.price.current}
          original={product.price.original}
          discount={product.price.discount}
          dealPrice={product.dealInfo?.dealPrice}
          isDeal={product.dealInfo?.isDeal}
        />

        {/* Bank & Coupon Offers Carousel */}
        <OfferSection />
      </div>

      {/* Product Highlights / Bullet Points */}
      <div className="pt-3">
        <h3 className="text-sm font-bold text-gray-900 mb-2">About this item</h3>
        <ul className="space-y-1.5 text-xs sm:text-sm text-gray-800 list-disc pl-5 leading-relaxed">
          {product.bulletPoints?.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;

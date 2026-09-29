'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetProductByIdQuery } from '@/store/api/productApi';
import { useAppDispatch } from '@/store/hooks';
import { addRecentlyViewed } from '@/store/slices/productSlice';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import BuyBox from '@/components/product/BuyBox';
import DeliveryInfo from '@/components/product/DeliveryInfo';
import VariantSelector from '@/components/product/VariantSelector';
import FrequentlyBoughtTogether from '@/components/product/FrequentlyBoughtTogether';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductDescription from '@/components/product/ProductDescription';
import SimilarProducts from '@/components/product/SimilarProducts';
import ProductReviews from '@/components/product/ProductReviews';
import ProductQA from '@/components/product/ProductQA';
import ProductBreadcrumb from '@/components/product/ProductBreadcrumb';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetProductByIdQuery(id, { skip: !id });
  const product = data?.data?.product;

  useEffect(() => {
    if (product) {
      dispatch(addRecentlyViewed(product));
    }
  }, [product, dispatch]);

  if (isLoading || !product) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-3 bg-white border-x border-gray-200">
      {/* Category Breadcrumbs */}
      <ProductBreadcrumb category={product.category} title={product.title} />

      {/* Core 3-Column Product View: Gallery (Left) | Details (Center) | BuyBox (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-4">
        {/* Column 1: Image Zoom Gallery */}
        <div className="lg:col-span-5">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Column 2: Product Specifications & Bullet Points */}
        <div className="lg:col-span-4 space-y-4">
          <ProductInfo product={product} />
          <VariantSelector variants={product.variants} />
          <DeliveryInfo />
        </div>

        {/* Column 3: The Right Buy Box */}
        <div className="lg:col-span-3">
          <BuyBox product={product} />
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <FrequentlyBoughtTogether currentProduct={product} />

      {/* Technical Details & Specs */}
      <ProductSpecs specifications={product.specifications} />

      {/* Overview & HTML Description */}
      <ProductDescription
        description={product.description}
        richDescription={product.richDescription}
      />

      {/* Related Products Carousel */}
      <SimilarProducts productId={product._id} />

      {/* Customer Reviews & Star Breakdowns */}
      <ProductReviews product={product} />

      {/* Customer Questions & Answers */}
      <ProductQA productId={product._id} />
    </div>
  );
}

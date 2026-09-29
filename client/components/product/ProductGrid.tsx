'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import ProductList from './ProductList';

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode = 'grid',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded border border-gray-300" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">No products found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Try clearing filters or searching for alternative keywords.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductList key={product._id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

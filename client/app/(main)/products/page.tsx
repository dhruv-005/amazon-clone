'use client';

import React, { useState } from 'react';
import { useGetProductsQuery } from '@/store/api/productApi';
import FilterSidebar from '@/components/filters/FilterSidebar';
import SortDropdown from '@/components/filters/SortDropdown';
import MobileFilters from '@/components/filters/MobileFilters';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';

export default function ProductsCatalogPage() {
  const [filters, setFilters] = useState<Record<string, any>>({
    page: 1,
    limit: 16,
    sort: 'featured',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading } = useGetProductsQuery(filters);
  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev, page: 1 };
      if (value === undefined || value === '') {
        delete updated[key];
      } else {
        updated[key] = value;
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    setFilters({ page: 1, limit: 16, sort: 'featured' });
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-4">
      {/* Top Results Bar */}
      <div className="bg-white border border-gray-200 rounded p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
        <div>
          <span className="font-bold text-gray-800">
            1-{products.length} of over {pagination.totalItems.toLocaleString()} results
          </span>
        </div>

        <div className="flex items-center gap-3">
          <MobileFilters
            selectedBrand={filters.brand}
            selectedRating={filters.rating}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* View Mode Toggle */}
          <div className="hidden sm:flex border rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 border-l ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
              title="List View"
            >
              ☰
            </button>
          </div>

          <SortDropdown
            currentSort={filters.sort}
            onSortChange={(val) => handleFilterChange('sort', val)}
          />
        </div>
      </div>

      {/* Main Filter Sidebar + Catalog Grid */}
      <div className="flex gap-6">
        <FilterSidebar
          selectedBrand={filters.brand}
          selectedRating={filters.rating}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          className="hidden lg:block bg-white p-4 rounded border border-gray-200 shadow-sm"
        />

        <div className="flex-1 space-y-6">
          <ProductGrid products={products} viewMode={viewMode} isLoading={isLoading} />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(p) => handleFilterChange('page', p)}
          />
        </div>
      </div>
    </div>
  );
}

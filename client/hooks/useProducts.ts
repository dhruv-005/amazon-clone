'use client';

import { useGetProductsQuery } from '@/store/api/productApi';

export const useProducts = (params: any = {}) => {
  const { data, isLoading, isError, refetch } = useGetProductsQuery(params);

  return {
    products: data?.data?.products || [],
    pagination: data?.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    isLoading,
    isError,
    refetch,
  };
};

export default useProducts;

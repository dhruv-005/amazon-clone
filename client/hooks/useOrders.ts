'use client';

import { useGetOrdersQuery } from '@/store/api/orderApi';

export const useOrders = (params: any = {}) => {
  const { data, isLoading, isError, refetch } = useGetOrdersQuery(params);

  return {
    orders: data?.data?.orders || [],
    pagination: data?.data?.pagination,
    isLoading,
    isError,
    refetch,
  };
};

export default useOrders;

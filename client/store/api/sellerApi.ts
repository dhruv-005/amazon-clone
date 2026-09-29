import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';
import { Seller, SellerDashboardStats } from '@/types/seller';

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSellerDashboard: builder.query<ApiResponse<{ stats: SellerDashboardStats; recentOrders: any[] }>, void>({
      query: () => '/seller/dashboard',
      providesTags: ['Seller', 'Order'],
    }),
    getSellerProducts: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/seller/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getSellerOrders: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/seller/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetSellerDashboardQuery,
  useGetSellerProductsQuery,
  useGetSellerOrdersQuery,
} = sellerApi;

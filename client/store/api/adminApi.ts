import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<any>, void>({
      query: () => '/admin/dashboard',
    }),
    getUsers: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getAllAdminProducts: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/admin/products',
        params,
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGetAllAdminProductsQuery,
} = adminApi;

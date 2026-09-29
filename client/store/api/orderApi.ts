import { baseApi } from './baseApi';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Order } from '@/types/order';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse<{ order: Order }>, any>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getOrders: builder.query<ApiResponse<PaginatedResponse<Order>>, any>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<ApiResponse<{ order: Order }>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation<ApiResponse<{ order: Order }>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderTracking: builder.query<ApiResponse<{ tracking: any }>, string>({
      query: (id) => `/orders/${id}/tracking`,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetOrderTrackingQuery,
} = orderApi;

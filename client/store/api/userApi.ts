import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';
import { Address, User } from '@/types/user';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<ApiResponse<{ addresses: Address[]; defaultAddress?: string }>, void>({
      query: () => '/users/addresses',
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation<ApiResponse<{ addresses: Address[] }>, Partial<Address>>({
      query: (body) => ({
        url: '/users/addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Address', 'User'],
    }),
    updateAddress: builder.mutation<ApiResponse<{ addresses: Address[] }>, { id: string; data: Partial<Address> }>({
      query: ({ id, data }) => ({
        url: `/users/addresses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Address', 'User'],
    }),
    deleteAddress: builder.mutation<ApiResponse<{ addresses: Address[] }>, string>({
      query: (id) => ({
        url: `/users/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address', 'User'],
    }),
    getBrowsingHistory: builder.query<ApiResponse<{ history: any[] }>, void>({
      query: () => '/users/browsing-history',
    }),
    clearBrowsingHistory: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/users/browsing-history',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetBrowsingHistoryQuery,
  useClearBrowsingHistoryMutation,
} = userApi;

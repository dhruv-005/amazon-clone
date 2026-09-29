import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<{ user: User; accessToken: string }>, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Cart', 'Wishlist'],
    }),
    register: builder.mutation<ApiResponse<{ user: User; accessToken: string }>, any>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Cart', 'Wishlist'],
    }),
    getMe: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    verifyEmailOTP: builder.mutation<ApiResponse<null>, { otp: string }>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useVerifyEmailOTPMutation,
} = authApi;

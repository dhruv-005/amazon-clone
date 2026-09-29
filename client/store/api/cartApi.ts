import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';
import { CartItem, SavedForLaterItem, CartSummary } from '@/types/cart';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<
      ApiResponse<{
        items: CartItem[];
        savedForLater: SavedForLaterItem[];
        summary: CartSummary;
      }>,
      void
    >({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<
      ApiResponse<{ items: CartItem[] }>,
      { productId: string; quantity?: number; variant?: any }
    >({
      query: (body) => ({
        url: '/cart/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<
      ApiResponse<{ items: CartItem[] }>,
      { itemId: string; quantity: number }
    >({
      query: ({ itemId, quantity }) => ({
        url: `/cart/update/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<ApiResponse<{ items: CartItem[] }>, string>({
      query: (itemId) => ({
        url: `/cart/remove/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    saveForLater: builder.mutation<ApiResponse<any>, string>({
      query: (itemId) => ({
        url: `/cart/save-for-later/${itemId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    moveToCart: builder.mutation<ApiResponse<any>, string>({
      query: (itemId) => ({
        url: `/cart/move-to-cart/${itemId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation<ApiResponse<any>, { code: string }>({
      query: (body) => ({
        url: '/cart/apply-coupon',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/cart/remove-coupon',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useSaveForLaterMutation,
  useMoveToCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;

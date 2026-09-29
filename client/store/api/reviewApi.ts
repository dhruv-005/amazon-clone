import { baseApi } from './baseApi';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Review } from '@/types/review';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ApiResponse<PaginatedResponse<Review>>, { productId: string; params?: any }>({
      query: ({ productId, params }) => ({
        url: `/reviews/product/${productId}`,
        params,
      }),
      providesTags: ['Review'],
    }),
    createReview: builder.mutation<ApiResponse<{ review: Review }>, any>({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
    markHelpful: builder.mutation<ApiResponse<{ helpfulVotes: number }>, string>({
      query: (id) => ({
        url: `/reviews/${id}/helpful`,
        method: 'POST',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useMarkHelpfulMutation,
} = reviewApi;

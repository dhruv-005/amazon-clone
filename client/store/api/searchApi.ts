import { baseApi } from './baseApi';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Product } from '@/types/product';

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProducts: builder.query<ApiResponse<PaginatedResponse<Product>>, any>({
      query: (params) => ({
        url: '/search',
        params,
      }),
    }),
    getSearchSuggestions: builder.query<ApiResponse<{ suggestions: any[] }>, string>({
      query: (q) => `/search/suggestions?q=${encodeURIComponent(q)}`,
    }),
    getAutocomplete: builder.query<ApiResponse<{ results: string[] }>, string>({
      query: (q) => `/search/autocomplete?q=${encodeURIComponent(q)}`,
    }),
  }),
});

export const {
  useSearchProductsQuery,
  useGetSearchSuggestionsQuery,
  useGetAutocompleteQuery,
} = searchApi;

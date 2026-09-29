import { baseApi } from './baseApi';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<PaginatedResponse<Product>>, any>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ApiResponse<{ product: Product }>, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getFeaturedProducts: builder.query<ApiResponse<{ products: Product[] }>, void>({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    getDealProducts: builder.query<ApiResponse<{ products: Product[] }>, void>({
      query: () => '/products/deals',
      providesTags: ['Product', 'Deal'],
    }),
    getRelatedProducts: builder.query<ApiResponse<{ products: Product[] }>, string>({
      query: (id) => `/products/${id}/related`,
    }),
    getFrequentlyBoughtTogether: builder.query<ApiResponse<{ products: Product[] }>, string>({
      query: (id) => `/products/${id}/frequently-bought`,
    }),
    getCategories: builder.query<ApiResponse<{ categories: Category[] }>, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getCategoryTree: builder.query<ApiResponse<{ categories: Category[] }>, void>({
      query: () => '/categories/tree',
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetDealProductsQuery,
  useGetRelatedProductsQuery,
  useGetFrequentlyBoughtTogetherQuery,
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
} = productApi;

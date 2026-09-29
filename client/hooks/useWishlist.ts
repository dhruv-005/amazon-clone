'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addWishlistLocal,
  removeWishlistLocal,
} from '@/store/slices/wishlistSlice';
import { Product } from '@/types/product';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const toggleWishlist = (product: Product) => {
    const exists = wishlistItems.some((i) => i.product._id === product._id);
    if (exists) {
      dispatch(removeWishlistLocal(product._id));
    } else {
      dispatch(addWishlistLocal(product));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((i) => i.product._id === productId);
  };

  return {
    wishlistItems,
    count: wishlistItems.length,
    toggleWishlist,
    isInWishlist,
  };
};

export default useWishlist;

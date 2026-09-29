'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addItemLocal,
  updateQuantityLocal,
  removeItemLocal,
  clearCartLocal,
} from '@/store/slices/cartSlice';
import { Product } from '@/types/product';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, summary, couponApplied } = useAppSelector(
    (state) => state.cart
  );

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, variant?: any) => {
    dispatch(addItemLocal({ product, quantity, variant }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateQuantityLocal({ itemId, quantity }));
  };

  const removeFromCart = (itemId: string) => {
    dispatch(removeItemLocal(itemId));
  };

  const clearCart = () => {
    dispatch(clearCartLocal());
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product._id === productId);
  };

  return {
    items,
    summary,
    couponApplied,
    totalCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
  };
};

export default useCart;

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { useAppDispatch } from '@/store/hooks';
import { addItemLocal } from '@/store/slices/cartSlice';
import { addWishlistLocal } from '@/store/slices/wishlistSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemLocal({ product, quantity: 1 }));
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addWishlistLocal(product));
  };

  const discount =
    product.price.discount ||
    (product.price.original > product.price.current
      ? Math.round(((product.price.original - product.price.current) / product.price.original) * 100)
      : 0);

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg rounded-sm p-4 flex flex-col justify-between transition-all duration-200">
      {/* Wishlist Floating Button */}
      <button
        onClick={handleAddToWishlist}
        title="Add to Wishlist"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      <div>
        {/* Product Image */}
        <Link href={`/products/${product._id}`} className="block relative h-52 w-full mb-3 bg-white">
          <Image
            src={product.images?.[0]?.url || '/placeholder.jpg'}
            alt={product.title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        </Link>

        {/* Amazon Badge */}
        {product.isFeatured && (
          <div className="mb-1.5">
            <Badge type="amazons-choice" />
          </div>
        )}

        {/* Product Title */}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-normal text-gray-900 line-clamp-2 hover:text-orange-600 hover:underline leading-snug mb-1">
            {product.title}
          </h3>
        </Link>

        {/* Rating Stars & Count */}
        <div className="mb-2">
          <Rating value={product.ratings?.average || 0} count={product.ratings?.count || 0} size="sm" />
        </div>

        {/* Deal Tag */}
        {product.dealInfo?.isDeal && (
          <div className="mb-1">
            <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
              Limited time deal
            </span>
          </div>
        )}

        {/* Price Block */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.current.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-500 line-through">
                M.R.P: ₹{product.price.original.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-[#cc0c39]">({discount}% off)</span>
            </>
          )}
        </div>

        {/* Prime Delivery & Shipping */}
        <div className="mt-1 text-xs text-gray-600 space-y-0.5">
          {product.shipping?.isPrimeEligible && (
            <div className="flex items-center gap-1 font-bold text-[#007185]">
              <span className="text-[#00a8e1] tracking-tighter">prime</span>
              <span>FREE One-Day Delivery</span>
            </div>
          )}
          {product.shipping?.isFreeShipping && !product.shipping?.isPrimeEligible && (
            <p>FREE Delivery by Amazon</p>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-3 w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] text-xs font-medium py-2 px-3 rounded-full border border-[#fcd200] shadow-sm transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

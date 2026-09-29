'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import Rating from '../ui/Rating';
import ProgressBar from '../ui/ProgressBar';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { useGetProductReviewsQuery, useCreateReviewMutation } from '@/store/api/reviewApi';
import { useAppSelector } from '@/store/hooks';

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const { data: reviewData } = useGetProductReviewsQuery({ productId: product._id });
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const reviews = reviewData?.data?.items || [];
  const ratings = product.ratings || { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  const dist = ratings.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await createReview({
        product: product._id,
        rating,
        title,
        comment,
      }).unwrap();
      setIsModalOpen(false);
      setTitle('');
      setComment('');
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div id="customer-reviews" className="my-10 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Rating Distribution */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Rating value={ratings.average} size="lg" showCount={false} />
            <span className="text-xl font-bold text-gray-900">{ratings.average} out of 5</span>
          </div>
          <p className="text-xs text-gray-500">{ratings.count.toLocaleString()} global ratings</p>

          {/* 5 to 1 Star Progress Bars */}
          <div className="space-y-2 pt-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[star as keyof typeof dist] || 0;
              const percent = ratings.count > 0 ? Math.round((count / ratings.count) * 100) : 0;
              return (
                <ProgressBar key={star} percent={percent} label={`${star} star`} />
              );
            })}
          </div>

          {/* Write a Review Button */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-sm text-gray-900 mb-1">Review this product</h3>
            <p className="text-xs text-gray-600 mb-3">Share your thoughts with other customers</p>
            {user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full border border-gray-300 hover:bg-gray-50 text-xs font-semibold py-2 rounded-md shadow-sm"
              >
                Write a product review
              </button>
            ) : (
              <p className="text-xs text-gray-500">
                Please log in to write a customer review.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No customer reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="space-y-2 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-700">
                    {rev.user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-xs font-bold text-gray-800">{rev.user?.name || 'Amazon Customer'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Rating value={rev.rating} size="sm" showCount={false} />
                  {rev.title && <span className="text-xs font-bold text-gray-900">{rev.title}</span>}
                </div>

                <p className="text-[11px] text-gray-500">
                  Reviewed in India on {new Date(rev.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </p>

                {rev.isVerifiedPurchase && (
                  <span className="text-[11px] text-[#c45500] font-bold block">
                    Verified Purchase
                  </span>
                )}

                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Review">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">Overall Rating</label>
            <Rating value={rating} size="lg" interactive onChange={(v) => setRating(v)} />
          </div>
          <Input
            label="Add a headline"
            placeholder="What's most important to know?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Add a written review"
            placeholder="What did you like or dislike? What did you use this product for?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Submit Review
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductReviews;

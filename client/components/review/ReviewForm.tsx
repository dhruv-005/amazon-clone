'use client';

import React, { useState } from 'react';
import Rating from '../ui/Rating';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

interface ReviewFormProps {
  onSubmit: (data: { rating: number; title: string; comment: string }) => void;
  isLoading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit({ rating, title, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="font-bold block mb-1 text-gray-900">Overall Rating</label>
        <Rating value={rating} size="lg" interactive onChange={(val) => setRating(val)} />
      </div>

      <Input
        label="Add a headline"
        placeholder="What's most important to know?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        label="Write your review"
        placeholder="What did you like or dislike? What did you use this product for?"
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button type="submit" variant="primary" isLoading={isLoading}>
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;

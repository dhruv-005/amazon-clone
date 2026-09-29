'use client';

import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { useGetCategoriesQuery } from '@/store/api/productApi';

interface ProductFormProps {
  initialData?: any;
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { data: categoryData } = useGetCategoriesQuery();
  const categories = categoryData?.data?.categories || [];

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category?._id || initialData?.category || '');
  const [originalPrice, setOriginalPrice] = useState(initialData?.price?.original || '');
  const [currentPrice, setCurrentPrice] = useState(initialData?.price?.current || '');
  const [stock, setStock] = useState(initialData?.stock || 10);
  const [bulletPointText, setBulletPointText] = useState(initialData?.bulletPoints?.join('\n') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      category,
      price: {
        original: Number(originalPrice),
        current: Number(currentPrice),
      },
      stock: Number(stock),
      bulletPoints: bulletPointText.split('\n').filter((p: string) => p.trim()),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 max-w-3xl text-xs">
      <h2 className="text-base font-bold text-gray-900 border-b pb-3">Product Listing Information</h2>

      <Input
        label="Product Title"
        required
        placeholder="e.g. Apple iPhone 15 (128 GB) - Black"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-bold text-gray-800 block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full bg-[#f0f2f2] border border-gray-300 rounded p-2 outline-none font-medium"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Stock Inventory Quantity"
          type="number"
          required
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Original Price (M.R.P. in ₹)"
          type="number"
          required
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
        />
        <Input
          label="Selling Price (₹)"
          type="number"
          required
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
        />
      </div>

      <Textarea
        label="Product Description"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Detailed product overview..."
      />

      <Textarea
        label="Key Bullet Points (1 per line)"
        value={bulletPointText}
        onChange={(e) => setBulletPointText(e.target.value)}
        placeholder="Enter key highlight on each line..."
        rows={4}
      />

      <div className="pt-3 border-t flex justify-end gap-3">
        <Button type="submit" variant="primary" isLoading={isLoading} className="px-8">
          Save & Publish Listing
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;

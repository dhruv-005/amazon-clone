'use client';

import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface BannerFormProps {
  onSubmit: (data: any) => void;
}

export const BannerForm: React.FC<BannerFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('/deals');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      image: { url: imageUrl },
      link,
      position: 'hero',
      isActive: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 text-xs max-w-lg">
      <h3 className="font-bold text-sm text-gray-900">Add Hero Carousel Banner</h3>
      <Input label="Banner Campaign Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input label="Image URL (1920x600 px)" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <Input label="Target Redirect Link" required value={link} onChange={(e) => setLink(e.target.value)} />
      <Button type="submit" variant="primary">Publish Banner</Button>
    </form>
  );
};

export default BannerForm;

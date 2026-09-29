'use client';

import React from 'react';

interface ProductVideosProps {
  videos?: Array<{ url: string; title?: string }>;
}

export const ProductVideos: React.FC<ProductVideosProps> = ({ videos = [] }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="my-8 space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Videos for this product</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((vid, idx) => (
          <div key={idx} className="aspect-video bg-black rounded overflow-hidden shadow">
            <video src={vid.url} controls className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductVideos;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from '../ui/Modal';

interface ReviewImagesProps {
  images: Array<{ url: string }>;
}

export const ReviewImages: React.FC<ReviewImagesProps> = ({ images = [] }) => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto py-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImg(img.url)}
            className="relative w-16 h-16 rounded border border-gray-300 overflow-hidden flex-shrink-0"
          >
            <Image src={img.url} alt="Customer upload" fill className="object-cover" />
          </button>
        ))}
      </div>

      <Modal isOpen={!!selectedImg} onClose={() => setSelectedImg(null)} maxWidth="lg">
        {selectedImg && (
          <div className="relative h-96 w-full">
            <Image src={selectedImg} alt="Customer review photo" fill className="object-contain" />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ReviewImages;

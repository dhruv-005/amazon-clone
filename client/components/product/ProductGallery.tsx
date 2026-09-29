'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [], title }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeImage = images[selectedIdx]?.url || '/placeholder.jpg';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-24 select-none">
      {/* Thumbnail Bar */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setSelectedIdx(idx)}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-12 h-12 md:w-14 md:h-14 rounded border-2 bg-white flex-shrink-0 transition-all ${
              selectedIdx === idx
                ? 'border-[#e77600] ring-1 ring-[#e77600] shadow-sm'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
          </button>
        ))}
      </div>

      {/* Main Image Viewport with Hover Zoom */}
      <div
        className="relative flex-1 h-[350px] sm:h-[450px] md:h-[520px] bg-white border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className={`object-contain p-4 transition-transform duration-100 ${
            isZoomed ? 'scale-150 origin-top-left' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <span className="absolute bottom-2 left-2 text-[11px] text-gray-400 pointer-events-none bg-white/80 px-2 py-0.5 rounded">
          Hover image to zoom
        </span>
      </div>
    </div>
  );
};

export default ProductGallery;

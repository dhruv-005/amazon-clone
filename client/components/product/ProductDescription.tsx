'use client';

import React from 'react';

interface ProductDescriptionProps {
  description: string;
  richDescription?: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  richDescription,
}) => {
  return (
    <div className="my-6 space-y-3">
      <h2 className="text-lg font-bold text-gray-900">Product Description</h2>
      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {description}
      </p>

      {richDescription && (
        <div
          className="prose max-w-none text-xs sm:text-sm text-gray-800 mt-4"
          dangerouslySetInnerHTML={{ __html: richDescription }}
        />
      )}
    </div>
  );
};

export default ProductDescription;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, multiple = false }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    const newPreviews = fileList.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
    onUpload(fileList);
  };

  return (
    <div className="space-y-3">
      <label className="border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50">
        <span className="text-2xl mb-1">📷</span>
        <span className="text-xs font-bold text-gray-700">Click to select photos</span>
        <span className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 10MB</span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {previews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {previews.map((src, i) => (
            <div key={i} className="relative w-16 h-16 rounded border overflow-hidden">
              <Image src={src} alt="Upload preview" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

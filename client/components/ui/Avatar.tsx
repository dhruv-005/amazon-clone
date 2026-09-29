'use client';

import React from 'react';
import Image from 'next/image';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  if (src) {
    return (
      <div className={`relative rounded-full overflow-hidden border border-gray-200 ${sizeStyles[size]}`}>
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`rounded-full bg-[#232f3e] text-white flex items-center justify-center font-bold select-none ${sizeStyles[size]}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;

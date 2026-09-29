'use client';

import React, { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        {title && <h2 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{title}</h2>}
        {subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>}
        <div>{children}</div>
      </div>
      {footer && <div className="mt-4 pt-3 border-t border-gray-100">{footer}</div>}
    </div>
  );
};

export default Card;

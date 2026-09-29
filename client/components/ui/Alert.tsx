'use client';

import React, { ReactNode } from 'react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    success: 'bg-green-50 border-green-500 text-green-800',
    warning: 'bg-amber-50 border-amber-500 text-amber-900',
    error: 'bg-red-50 border-red-500 text-red-800',
  };

  return (
    <div className={`p-4 rounded border-l-4 text-sm ${styles[type]} ${className}`}>
      {title && <h4 className="font-bold mb-1">{title}</h4>}
      <div>{children}</div>
    </div>
  );
};

export default Alert;

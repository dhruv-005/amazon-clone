'use client';

import React, { useEffect } from 'react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: 'bg-emerald-600 text-white border-emerald-700',
    error: 'bg-red-600 text-white border-red-700',
    warning: 'bg-amber-500 text-gray-900 border-amber-600',
    info: 'bg-[#131921] text-white border-gray-800',
  };

  return (
    <div
      className={`flex items-center justify-between min-w-[280px] max-w-sm px-4 py-3 rounded shadow-lg border text-sm font-medium animate-slideInRight ${typeStyles[type]}`}
    >
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-3 opacity-70 hover:opacity-100 font-bold"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;

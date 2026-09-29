'use client';

import React, { useEffect, ReactNode } from 'react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Drawer */}
      <div className="relative w-80 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideInLeft">
        <div className="flex items-center justify-between p-4 bg-[#232f3e] text-white">
          <h3 className="font-bold text-base">{title || 'Menu'}</h3>
          <button onClick={onClose} className="text-white hover:opacity-75 text-lg font-bold">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;

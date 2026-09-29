'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';

export const AdminHeader: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between select-none shadow-sm">
      <h2 className="text-base font-bold text-gray-800">Master Control Center</h2>

      <div className="flex items-center gap-4 text-xs">
        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
          ● Platform Live
        </span>
        <div className="text-right">
          <span className="font-bold text-gray-900 block">{user?.name || 'Administrator'}</span>
          <span className="text-gray-500 text-[10px] uppercase font-semibold">Super Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

'use client';

import React from 'react';

interface SellerTableProps {
  sellers: any[];
  onVerifySeller?: (id: string) => void;
}

export const SellerTable: React.FC<SellerTableProps> = ({ sellers = [], onVerifySeller }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700 font-bold">
            <th className="p-3">Business Name</th>
            <th className="p-3">Contact</th>
            <th className="p-3">GSTIN</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Verification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sellers.map((s) => (
            <tr key={s._id} className="hover:bg-gray-50">
              <td className="p-3 font-bold text-gray-900">{s.businessName}</td>
              <td className="p-3">{s.user?.email || s.user?.phone}</td>
              <td className="p-3 font-mono">{s.gstNumber || 'Unregistered'}</td>
              <td className="p-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {s.isVerified ? 'Verified' : 'Pending Review'}
                </span>
              </td>
              <td className="p-3 text-right">
                {!s.isVerified && onVerifySeller && (
                  <button
                    onClick={() => onVerifySeller(s._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold"
                  >
                    Grant Approval
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerTable;

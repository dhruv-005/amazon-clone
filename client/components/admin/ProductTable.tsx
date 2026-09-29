'use client';

import React from 'react';
import { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
  onToggleApprove?: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onToggleApprove }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700 font-bold">
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-900 max-w-sm truncate">{p.title}</td>
              <td className="p-3 text-gray-600">{p.category?.name || 'General'}</td>
              <td className="p-3 font-bold">₹{p.price?.current?.toLocaleString('en-IN')}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.isApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {p.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td className="p-3 text-right">
                {onToggleApprove && (
                  <button
                    onClick={() => onToggleApprove(p._id)}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    {p.isApproved ? 'Unpublish' : 'Approve'}
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

export default ProductTable;

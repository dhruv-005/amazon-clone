'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

interface InventoryTableProps {
  products: Product[];
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ products }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm text-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700 font-bold">
            <th className="p-3">Product Name</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock Available</th>
            <th className="p-3">Units Sold</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-900 max-w-xs truncate">{p.title}</td>
              <td className="p-3 font-mono text-gray-500">{p.sku || 'N/A'}</td>
              <td className="p-3 font-bold">₹{p.price.current.toLocaleString('en-IN')}</td>
              <td className="p-3">
                <span className={`font-bold ${p.stock <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {p.stock} units
                </span>
              </td>
              <td className="p-3 text-gray-600">{p.totalSold || 0}</td>
              <td className="p-3 text-right">
                <Link
                  href={`/seller/products/edit/${p._id}`}
                  className="text-[#007185] hover:underline font-semibold mr-3"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;

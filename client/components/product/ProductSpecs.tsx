'use client';

import React from 'react';
import { ProductSpecification } from '@/types/product';

interface ProductSpecsProps {
  specifications: ProductSpecification[];
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specifications = [] }) => {
  if (specifications.length === 0) return null;

  return (
    <div className="my-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Technical Details</h2>
      <div className="border border-gray-300 rounded overflow-hidden">
        <table className="w-full text-xs sm:text-sm text-left border-collapse">
          <tbody>
            {specifications.map((spec, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-[#f3f3f3]' : 'bg-white'}
              >
                <th className="py-2.5 px-4 font-bold text-gray-800 w-1/3 sm:w-1/4 border-r border-gray-300">
                  {spec.key}
                </th>
                <td className="py-2.5 px-4 text-gray-700">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSpecs;

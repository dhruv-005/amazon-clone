'use client';

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-6 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
      >
        ← Previous
      </button>

      {pages.map((p, idx) => (
        <React.Fragment key={p}>
          {idx > 0 && pages[idx - 1] !== p - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 border rounded text-xs font-medium transition-colors ${
              currentPage === p
                ? 'bg-[#ffd814] border-[#fcd200] text-black font-bold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;

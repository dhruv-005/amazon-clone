'use client';

import React, { useState } from 'react';
import Input from '../ui/Input';

interface ProductQAProps {
  productId: string;
}

export const ProductQA: React.FC<ProductQAProps> = ({ productId }) => {
  const [query, setQuery] = useState('');

  const dummyQAs = [
    {
      question: 'Is Cash on Delivery (COD) supported for this item?',
      answer: 'Yes, full Cash on Delivery is available across all eligible pin codes.',
      votes: 34,
    },
    {
      question: 'What is the manufacturer warranty duration?',
      answer: 'It comes with a standard 1-year brand warranty covering parts and labor.',
      votes: 18,
    },
  ];

  return (
    <div id="customer-qa" className="my-8 border-t border-gray-200 pt-8 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Customer questions & answers</h2>

      <div className="max-w-md">
        <Input
          placeholder="Have a question? Search for answers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4 pt-2">
        {dummyQAs.map((qa, i) => (
          <div key={i} className="text-xs sm:text-sm space-y-1">
            <p className="font-bold text-gray-900">
              <span className="text-gray-500 font-normal">Q: </span>
              {qa.question}
            </p>
            <p className="text-gray-800">
              <span className="text-gray-500 font-normal">A: </span>
              {qa.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductQA;

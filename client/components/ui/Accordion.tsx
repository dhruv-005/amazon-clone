'use client';

import React, { useState, ReactNode } from 'react';

export interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-bold text-xs text-gray-900"
      >
        <span>{title}</span>
        <span className="text-gray-500 text-sm">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="pt-2 text-xs text-gray-700">{children}</div>}
    </div>
  );
};

export default Accordion;

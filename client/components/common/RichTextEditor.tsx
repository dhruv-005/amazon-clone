'use client';

import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <div className="space-y-1 w-full text-xs">
      {label && <label className="font-bold text-gray-900">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Enter product description (HTML or Plain Text)..."
        className="w-full border border-gray-400 rounded p-3 text-xs outline-none focus:border-orange-500 font-mono"
      />
    </div>
  );
};

export default RichTextEditor;

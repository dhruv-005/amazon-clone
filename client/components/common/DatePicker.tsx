'use client';

import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {
  return (
    <div className="flex flex-col gap-1 text-xs">
      {label && <label className="font-bold text-gray-900">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-orange-500 bg-white"
      />
    </div>
  );
};

export default DatePicker;

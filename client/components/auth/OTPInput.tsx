'use client';

import React, { useState, useRef } from 'react';
import Button from '../ui/Button';

interface OTPInputProps {
  onVerify: (otp: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ onVerify, onResend, isLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length === 6) {
      onVerify(fullCode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-center">
      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-10 h-12 text-center text-lg font-bold border border-gray-400 rounded focus:border-orange-500 focus:ring-2 focus:ring-orange-400/30 outline-none"
          />
        ))}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={otp.some((d) => !d)}
      >
        Verify OTP
      </Button>

      {onResend && (
        <button
          type="button"
          onClick={onResend}
          className="text-xs text-[#007185] hover:underline font-medium block mx-auto mt-2"
        >
          Resend OTP code
        </button>
      )}
    </form>
  );
};

export default OTPInput;

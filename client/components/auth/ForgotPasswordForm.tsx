'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSent(true);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-2xl font-normal text-gray-900">Password assistance</h1>
      <p className="text-gray-700">
        Enter the email address associated with your Amazon account.
      </p>

      {isSent ? (
        <div className="p-3 bg-emerald-50 border border-emerald-400 rounded text-emerald-800">
          <p className="font-bold">Check your email</p>
          <p className="mt-1">We have sent password reset instructions to <strong>{email}</strong>.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="primary" fullWidth>
            Continue
          </Button>
        </form>
      )}

      <div className="pt-2">
        <Link href="/login" className="text-[#007185] hover:underline font-medium">
          ← Back to Sign-In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

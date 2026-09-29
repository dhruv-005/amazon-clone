'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    alert('Password updated successfully! Redirecting to login...');
    router.push('/login');
  };

  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-2xl font-normal text-gray-900">Create new password</h1>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-400 rounded text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="New password"
          type="password"
          placeholder="At least 6 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Re-enter password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" variant="primary" fullWidth>
          Save changes and Sign in
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

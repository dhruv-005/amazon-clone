'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [registerApi, { isLoading }] = useRegisterMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Passwords must be at least 6 characters.');
      return;
    }

    try {
      const res = await registerApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      }).unwrap();

      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      router.push('/verify-email');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-2xl font-normal text-gray-900">Create Account</h1>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-400 rounded text-red-700 text-xs">
          <strong>Error</strong>
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3">
        <Input
          label="Your name"
          placeholder="First and last name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Mobile number (optional)"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
        />

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          helperText="Passwords must be at least 6 characters."
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Verify email
        </Button>
      </form>

      <p className="text-[11px] text-gray-600 leading-tight">
        By creating an account or logging in, you agree to Amazon's{' '}
        <Link href="/terms" className="text-[#007185] hover:underline">Conditions of Use</Link> and{' '}
        <Link href="/privacy" className="text-[#007185] hover:underline">Privacy Notice</Link>.
      </p>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-800">
          Already have an account?{' '}
          <Link href="/login" className="text-[#007185] font-bold hover:underline">
            Sign in ›
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

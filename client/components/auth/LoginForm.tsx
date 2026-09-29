'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loginApi, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const res = await loginApi({ email: email.trim(), password }).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-2xl font-normal text-gray-900">Sign in</h1>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-400 rounded text-red-700 text-xs">
          <strong>There was a problem</strong>
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-3">
        <Input
          label="Email or mobile phone number"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="font-bold text-gray-800">Password</label>
            <Link href="/forgot-password" className="text-[#007185] hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <p className="text-[11px] text-gray-600 leading-tight">
        By continuing, you agree to Amazon Clone's{' '}
        <Link href="/terms" className="text-[#007185] hover:underline">Conditions of Use</Link> and{' '}
        <Link href="/privacy" className="text-[#007185] hover:underline">Privacy Notice</Link>.
      </p>

      {/* Create Account Divider */}
      <div className="pt-4 border-t border-gray-200 text-center space-y-2">
        <span className="text-[11px] text-gray-500 bg-white px-2 -mt-6 inline-block font-normal">
          New to Amazon?
        </span>
        <Link
          href="/register"
          className="w-full inline-block bg-white hover:bg-gray-50 text-gray-900 border border-gray-400 rounded-md py-1.5 text-xs font-medium shadow-sm transition"
        >
          Create your Amazon account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

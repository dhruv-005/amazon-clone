'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OTPInput from '@/components/auth/OTPInput';
import { useVerifyEmailOTPMutation } from '@/store/api/authApi';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyEmailOTPMutation();

  const handleVerify = async (otp: string) => {
    try {
      await verifyOtp({ otp }).unwrap();
      alert('Email verified successfully!');
      router.push('/');
    } catch (err: any) {
      alert(err?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="space-y-4 text-xs">
      <h1 className="text-2xl font-normal text-gray-900">Verification Required</h1>
      <p className="text-gray-600">
        To verify your email, we've sent a One-Time Password (OTP) to your registered email address.
      </p>

      <OTPInput onVerify={handleVerify} isLoading={isLoading} />
    </div>
  );
}

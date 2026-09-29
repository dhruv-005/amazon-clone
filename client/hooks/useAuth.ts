'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, accessToken, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async (redirectUrl = '/') => {
    try {
      await logoutApi().unwrap();
    } catch {}
    dispatch(logoutAction());
    router.push(redirectUrl);
  };

  return {
    user,
    token: accessToken,
    isAuthenticated,
    isLoading,
    isSeller: user?.role === 'seller' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    isPrime: user?.isPrime || false,
    logout: handleLogout,
  };
};

export default useAuth;

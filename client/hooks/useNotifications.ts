'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addNotification,
  markAllRead,
} from '@/store/slices/notificationSlice';
import { Notification } from '@/types/notification';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notification
  );

  const pushNotification = (notif: Notification) => {
    dispatch(addNotification(notif));
  };

  const clearAll = () => {
    dispatch(markAllRead());
  };

  return {
    notifications,
    unreadCount,
    pushNotification,
    clearAll,
  };
};

export default useNotifications;

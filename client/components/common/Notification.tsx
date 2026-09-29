'use client';

import React from 'react';
import { Notification as NotificationType } from '@/types/notification';

interface NotificationProps {
  notification: NotificationType;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  return (
    <div className="bg-white border border-gray-200 rounded p-3 shadow-md flex justify-between items-start gap-3 text-xs">
      <div>
        <h4 className="font-bold text-gray-900">{notification.title}</h4>
        <p className="text-gray-600 mt-0.5">{notification.message}</p>
        <span className="text-[10px] text-gray-400 mt-1 block">
          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-black font-bold">
          ✕
        </button>
      )}
    </div>
  );
};

export default Notification;

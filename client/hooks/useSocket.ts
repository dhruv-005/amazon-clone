'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const token = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    socketRef.current = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  return socketRef.current;
};

export default useSocket;

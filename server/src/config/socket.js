// ============================================
// SOCKET.IO CONFIGURATION - Real-time Features
// ============================================

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './index.js';
import logger from './logger.js';
import User from '../models/User.js';

let io = null;

// Store connected users: Map<userId, Set<socketId>>
const connectedUsers = new Map();

/**
 * Initialize Socket.IO Server
 * @param {object} httpServer - HTTP server instance
 * @returns {object} Socket.IO server instance
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        // Allow unauthenticated connections for public features
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(token, config.jwt.accessSecret);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      logger.error(`Socket auth error: ${error.message}`);
      socket.user = null;
      next(); // Allow connection but mark as unauthenticated
    }
  });

  // Connection Handler
  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString();

    if (userId) {
      // Track connected user
      if (!connectedUsers.has(userId)) {
        connectedUsers.set(userId, new Set());
      }
      connectedUsers.get(userId).add(socket.id);

      // Join user's personal room
      socket.join(`user:${userId}`);

      logger.info(`User ${userId} connected (Socket: ${socket.id})`);
    }

    logger.info(`New connection: ${socket.id} | Total: ${io.engine.clientsCount}`);

    // ---- EVENT HANDLERS ----

    // Join a specific room (e.g., order tracking room)
    socket.on('join-room', (roomName) => {
      socket.join(roomName);
      logger.info(`Socket ${socket.id} joined room: ${roomName}`);
    });

    // Leave a room
    socket.on('leave-room', (roomName) => {
      socket.leave(roomName);
      logger.info(`Socket ${socket.id} left room: ${roomName}`);
    });

    // Chat message
    socket.on('send-message', async (data) => {
      try {
        const { receiverId, message, type = 'text' } = data;

        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        const messageData = {
          senderId: socket.user._id,
          senderName: socket.user.name,
          receiverId,
          message,
          type,
          timestamp: new Date(),
        };

        // Send to receiver's room
        io.to(`user:${receiverId}`).emit('receive-message', messageData);

        // Confirm to sender
        socket.emit('message-sent', {
          ...messageData,
          status: 'delivered',
        });
      } catch (error) {
        logger.error(`Send message error: ${error.message}`);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      io.to(`user:${receiverId}`).emit('user-typing', {
        userId: socket.user?._id,
        isTyping,
      });
    });

    // Notification acknowledgment
    socket.on('notification-read', (notificationId) => {
      if (userId) {
        io.to(`user:${userId}`).emit('notification-updated', {
          notificationId,
          isRead: true,
        });
      }
    });

    // Disconnect Handler
    socket.on('disconnect', (reason) => {
      if (userId) {
        const userSockets = connectedUsers.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            connectedUsers.delete(userId);
          }
        }
      }
      logger.info(`Socket ${socket.id} disconnected: ${reason}`);
    });
  });

  logger.info('✅ Socket.IO Initialized');
  return io;
};

/**
 * Get Socket.IO Instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket() first.');
  }
  return io;
};

/**
 * Send notification to specific user
 * @param {string} userId - Target user ID
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
export const emitToUser = (userId, event, data) => {
  try {
    const socketIo = getIO();
    socketIo.to(`user:${userId}`).emit(event, data);
  } catch (error) {
    logger.error(`Emit to user error: ${error.message}`);
  }
};

/**
 * Send notification to all connected users
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
export const emitToAll = (event, data) => {
  try {
    const socketIo = getIO();
    socketIo.emit(event, data);
  } catch (error) {
    logger.error(`Emit to all error: ${error.message}`);
  }
};

/**
 * Send to a specific room
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
export const emitToRoom = (room, event, data) => {
  try {
    const socketIo = getIO();
    socketIo.to(room).emit(event, data);
  } catch (error) {
    logger.error(`Emit to room error: ${error.message}`);
  }
};

/**
 * Check if user is online
 * @param {string} userId - User ID
 * @returns {boolean}
 */
export const isUserOnline = (userId) => {
  return connectedUsers.has(userId) && connectedUsers.get(userId).size > 0;
};

/**
 * Get online users count
 * @returns {number}
 */
export const getOnlineUsersCount = () => {
  return connectedUsers.size;
};

export default initSocket;

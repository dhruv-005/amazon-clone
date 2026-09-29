import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import logger from '../config/logger.js';
import User from '../models/User.js';
import registerNotificationSocket from './notificationSocket.js';
import registerOrderSocket from './orderSocket.js';
import registerChatSocket from './chatSocket.js';

// Map of active online users: userId -> Set of socketIds
export const onlineUsers = new Map();

/**
 * Socket.IO Middleware for JWT Handshake Authentication
 */
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
      socket.handshake.query?.token;

    if (!token) {
      // Unauthenticated socket connection (allowed for public tracking/browsing)
      socket.user = null;
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const user = await User.findById(decoded.id).select('_id name email role avatar isPrime').lean();

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    logger.warn(`Socket authentication failed: ${error.message}`);
    socket.user = null;
    next(); // Continue as guest without terminating connection
  }
};

/**
 * Main Socket Setup
 * @param {import('socket.io').Server} io
 */
export const initSockets = (io) => {
  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString();

    if (userId) {
      // Add socket ID to online users map
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Join individual user room
      socket.join(`user:${userId}`);

      // Broadcast user online status
      socket.broadcast.emit('user:online', { userId });
      logger.info(`⚡ Socket Connected: User ${userId} (${socket.id})`);
    } else {
      logger.info(`⚡ Socket Connected: Guest (${socket.id})`);
    }

    // Register modular feature handlers
    registerNotificationSocket(io, socket);
    registerOrderSocket(io, socket);
    registerChatSocket(io, socket);

    // General room joiner
    socket.on('room:join', (roomName) => {
      socket.join(roomName);
      logger.debug(`Socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on('room:leave', (roomName) => {
      socket.leave(roomName);
      logger.debug(`Socket ${socket.id} left room: ${roomName}`);
    });

    // Disconnect handling
    socket.on('disconnect', (reason) => {
      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('user:offline', { userId });
        }
      }
      logger.info(`🔌 Socket Disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

export default initSockets;

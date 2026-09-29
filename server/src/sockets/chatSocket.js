import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import logger from '../config/logger.js';

/**
 * Register Real-Time Chat & Support Socket Listeners
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export const registerChatSocket = (io, socket) => {
  const userId = socket.user?._id?.toString();

  // Join a specific chat room
  socket.on('chat:join', async ({ chatId }) => {
    if (!userId) return;

    try {
      const chat = await Chat.findOne({
        _id: chatId,
        'participants.user': userId,
      });

      if (!chat) {
        return socket.emit('chat:error', { message: 'Chat room not found or access denied' });
      }

      socket.join(`chat:${chatId}`);

      // Mark unread messages as read
      chat.markAsRead(userId);
      await chat.save();

      socket.emit('chat:joined', { chatId });
    } catch (error) {
      logger.error(`Socket chat:join error: ${error.message}`);
    }
  });

  // Leave chat room
  socket.on('chat:leave', ({ chatId }) => {
    socket.leave(`chat:${chatId}`);
  });

  // Real-time message sender
  socket.on('chat:send_message', async ({ chatId, text, attachments = [], type = 'text', replyTo }) => {
    if (!userId) {
      return socket.emit('chat:error', { message: 'Authentication required' });
    }

    try {
      const chat = await Chat.findOne({
        _id: chatId,
        'participants.user': userId,
      });

      if (!chat) {
        return socket.emit('chat:error', { message: 'Chat room not found' });
      }

      // Create and persist message
      const message = await Message.create({
        chat: chatId,
        sender: userId,
        senderName: socket.user.name,
        senderAvatar: socket.user.avatar,
        senderRole: socket.user.role,
        text,
        attachments,
        type,
        replyTo,
      });

      // Update last message in chat document
      chat.updateLastMessage({
        text,
        sender: userId,
        senderName: socket.user.name,
        type,
      });
      await chat.save();

      // Broadcast new message to all members in the chat room
      io.to(`chat:${chatId}`).emit('chat:new_message', message);

      // Also send notification alert to offline/unfocused participants
      chat.participants.forEach((p) => {
        const participantId = p.user.toString();
        if (participantId !== userId) {
          io.to(`user:${participantId}`).emit('chat:notification', {
            chatId,
            senderName: socket.user.name,
            text,
          });
        }
      });
    } catch (error) {
      logger.error(`Socket chat:send_message error: ${error.message}`);
      socket.emit('chat:error', { message: 'Failed to deliver message' });
    }
  });

  // User typing indicator
  socket.on('chat:typing', ({ chatId, isTyping }) => {
    if (!userId) return;

    socket.to(`chat:${chatId}`).emit('chat:user_typing', {
      chatId,
      userId,
      userName: socket.user.name,
      isTyping,
    });
  });

  // Read message acknowledgment
  socket.on('chat:mark_read', async ({ chatId, messageId }) => {
    if (!userId) return;

    try {
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { readBy: { user: userId, readAt: new Date() } },
        $set: { isRead: true },
      });

      socket.to(`chat:${chatId}`).emit('chat:message_read', {
        chatId,
        messageId,
        readBy: userId,
      });
    } catch (error) {
      logger.error(`Socket chat:mark_read error: ${error.message}`);
    }
  });
};

export default registerChatSocket;

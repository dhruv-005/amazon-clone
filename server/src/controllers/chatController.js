import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';
import { emitToUser } from '../config/socket.js';

export const getOrCreateChat = asyncHandler(async (req, res) => {
  const { recipientId, type = 'customer_support', orderId, productId } = req.body;

  let chat = await Chat.findOne({
    type,
    'participants.user': { $all: [req.user._id, recipientId || req.user._id] },
    isActive: true,
  });

  if (!chat) {
    chat = await Chat.create({
      type,
      participants: [
        { user: req.user._id, role: req.user.role },
        ...(recipientId ? [{ user: recipientId, role: 'seller' }] : []),
      ],
      order: orderId,
      product: productId,
    });
  }

  res.json(new ApiResponse(200, { chat }));
});

export const getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    'participants.user': req.user._id,
    isActive: true,
  })
    .sort({ updatedAt: -1 })
    .populate('participants.user', 'name avatar role')
    .lean();

  res.json(new ApiResponse(200, { chats }));
});

export const getChatMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const chat = await Chat.findOne({
    _id: req.params.chatId,
    'participants.user': req.user._id,
  });

  if (!chat) throw ApiError.forbidden('Access denied to this chat');

  const [messages, total] = await Promise.all([
    Message.find({ chat: req.params.chatId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name avatar')
      .lean(),
    Message.countDocuments({ chat: req.params.chatId, isDeleted: false }),
  ]);

  sendPaginatedResponse(res, messages.reverse(), total, page, limit, 'Messages fetched');
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text, attachments = [], type = 'text' } = req.body;

  const chat = await Chat.findOne({
    _id: req.params.chatId,
    'participants.user': req.user._id,
  });

  if (!chat) throw ApiError.forbidden('Access denied to this chat');

  const message = await Message.create({
    chat: chat._id,
    sender: req.user._id,
    senderName: req.user.name,
    senderAvatar: req.user.avatar,
    senderRole: req.user.role,
    text,
    attachments,
    type,
  });

  chat.updateLastMessage({
    text,
    sender: req.user._id,
    senderName: req.user.name,
    type,
  });
  await chat.save();

  chat.participants.forEach((p) => {
    if (p.user.toString() !== req.user._id.toString()) {
      emitToUser(p.user.toString(), 'receive-message', message);
    }
  });

  res.status(201).json(new ApiResponse(201, { message }, 'Message sent'));
});

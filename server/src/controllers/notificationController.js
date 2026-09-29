import Notification from '../models/Notification.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';
import { emitToUser } from '../config/socket.js';

export const getUserNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: req.user._id }),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  res.json(new ApiResponse(200, {
    notifications,
    unreadCount,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  }));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  if (req.params.id === 'all') {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
  } else {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { isRead: true, readAt: new Date() } }
    );
  }

  res.json(new ApiResponse(200, null, 'Marked as read'));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json(new ApiResponse(200, null, 'Notification deleted'));
});

export const createNotification = async ({ userId, type, title, message, data = {} }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    data,
  });

  emitToUser(userId.toString(), 'notification', notification);
  return notification;
};

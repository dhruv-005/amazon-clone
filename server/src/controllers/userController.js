import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    '-password -otp -resetPasswordToken -resetPasswordExpire'
  );
  res.json(new ApiResponse(200, { user }));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, preferences } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -otp');

  res.json(new ApiResponse(200, { user }, 'Profile updated'));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.uploadedFile) {
    throw new ApiError(400, 'No image uploaded.');
  }

  const user = await User.findById(req.user._id);

  if (user.avatar && user.avatarPublicId) {
    await deleteFromCloudinary(user.avatarPublicId).catch(() => {});
  }

  user.avatar = req.uploadedFile.url;
  await user.save();

  res.json(new ApiResponse(200, { avatar: user.avatar }, 'Avatar updated'));
});

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses defaultAddress');
  res.json(new ApiResponse(200, { addresses: user.addresses, defaultAddress: user.defaultAddress }));
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressData = { ...req.body, _id: undefined };

  if (addressData.isDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false; });
  }

  user.addresses.push(addressData);
  if (user.addresses.length === 1) {
    user.addresses[0].isDefault = true;
    user.defaultAddress = user.addresses[0]._id;
  }

  await user.save();
  res.status(201).json(new ApiResponse(201, { addresses: user.addresses }, 'Address added'));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) throw ApiError.notFound('Address');

  Object.assign(address, req.body);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false; });
    address.isDefault = true;
    user.defaultAddress = address._id;
  }

  await user.save();
  res.json(new ApiResponse(200, { addresses: user.addresses }, 'Address updated'));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.id
  );
  await user.save();
  res.json(new ApiResponse(200, { addresses: user.addresses }, 'Address deleted'));
});

export const getBrowsingHistory = asyncHandler(async (req, res) => {
  const BrowsingHistory = (await import('../models/BrowsingHistory.js')).default;
  const history = await BrowsingHistory.find({ user: req.user._id })
    .populate('product', 'title slug images price.current ratings.average')
    .sort({ viewedAt: -1 })
    .limit(50)
    .lean();

  res.json(new ApiResponse(200, { history }));
});

export const clearBrowsingHistory = asyncHandler(async (req, res) => {
  const BrowsingHistory = (await import('../models/BrowsingHistory.js')).default;
  await BrowsingHistory.deleteMany({ user: req.user._id });
  res.json(new ApiResponse(200, null, 'Browsing history cleared'));
});

export const getNotifications = asyncHandler(async (req, res) => {
  const Notification = (await import('../models/Notification.js')).default;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Notification.countDocuments({ user: req.user._id }),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  res.json(new ApiResponse(200, { notifications, total, unreadCount, page: Number(page) }));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const Notification = (await import('../models/Notification.js')).default;

  if (req.params.id === 'all') {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  } else {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true, readAt: new Date() }
    );
  }

  res.json(new ApiResponse(200, null, 'Notifications marked as read'));
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { preferences: { ...req.user.preferences, ...req.body } } },
    { new: true }
  ).select('preferences');

  res.json(new ApiResponse(200, { preferences: user.preferences }, 'Preferences updated'));
});

import Address from '../models/Address.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id, isActive: true })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();

  res.json(new ApiResponse(200, { addresses }));
});

export const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
    isActive: true,
  }).lean();

  if (!address) throw new ApiError(404, 'Address not found');
  res.json(new ApiResponse(200, { address }));
});

export const createAddress = asyncHandler(async (req, res) => {
  const count = await Address.countDocuments({ user: req.user._id, isActive: true });
  const isDefault = count === 0 ? true : req.body.isDefault;

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    ...req.body,
    user: req.user._id,
    isDefault,
  });

  res.status(201).json(new ApiResponse(201, { address }, 'Address created'));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw new ApiError(404, 'Address not found');

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  res.json(new ApiResponse(200, { address }, 'Address updated'));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isActive: false },
    { new: true }
  );

  if (!address) throw new ApiError(404, 'Address not found');
  res.json(new ApiResponse(200, null, 'Address deleted'));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  await Address.updateMany({ user: req.user._id }, { isDefault: false });
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isDefault: true },
    { new: true }
  );

  if (!address) throw new ApiError(404, 'Address not found');
  res.json(new ApiResponse(200, { address }, 'Default address set'));
});

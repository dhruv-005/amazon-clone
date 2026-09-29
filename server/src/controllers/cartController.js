import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title slug images price stock isActive shipping',
  }).populate({
    path: 'savedForLater.product',
    select: 'title slug images price stock isActive',
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], savedForLater: [] });
    cart = await Cart.findById(cart._id).populate('items.product savedForLater.product');
  }

  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);

  const validItems = cart.items.filter((item) => item.product?.isActive);
  const subtotal = validItems.reduce(
    (sum, item) => sum + (item.product?.price?.current || 0) * item.quantity, 0
  );
  const savings = validItems.reduce(
    (sum, item) => sum + ((item.product?.price?.original || 0) - (item.product?.price?.current || 0)) * item.quantity, 0
  );

  res.json(new ApiResponse(200, {
    items: validItems,
    savedForLater: cart.savedForLater,
    summary: {
      totalItems: validItems.reduce((s, i) => s + i.quantity, 0),
      subtotal: Math.round(subtotal),
      savings: Math.round(savings),
      couponDiscount: cart.couponApplied?.discount || 0,
    },
  }));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw ApiError.productNotFound();
  if (product.stock < quantity) throw ApiError.insufficientStock();

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) => item.product._id.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock, 10);
  } else {
    cart.items.push({ product: productId, quantity, variant });
  }

  await cart.save();
  const updatedCart = await getOrCreateCart(req.user._id);

  res.json(new ApiResponse(200, { items: updatedCart.items }, 'Item added to cart'));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) throw new ApiError(404, 'Cart item not found');
  if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');
  if (quantity > 10) throw new ApiError(400, 'Maximum 10 items allowed');

  const product = await Product.findById(item.product);
  if (product && quantity > product.stock) throw ApiError.insufficientStock();

  item.quantity = quantity;
  await cart.save();

  const updatedCart = await getOrCreateCart(req.user._id);
  res.json(new ApiResponse(200, { items: updatedCart.items }, 'Cart updated'));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
  await cart.save();

  const updatedCart = await getOrCreateCart(req.user._id);
  res.json(new ApiResponse(200, { items: updatedCart.items }, 'Item removed'));
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponApplied: null });
  res.json(new ApiResponse(200, null, 'Cart cleared'));
});

export const saveForLater = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) throw new ApiError(404, 'Cart item not found');

  cart.savedForLater.push({
    product: item.product,
    variant: item.variant,
    priceWhenSaved: item.product?.price?.current,
  });
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();

  const updatedCart = await getOrCreateCart(req.user._id);
  res.json(new ApiResponse(200, {
    items: updatedCart.items,
    savedForLater: updatedCart.savedForLater,
  }, 'Moved to Save for Later'));
});

export const moveToCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const savedItem = cart.savedForLater.id(req.params.itemId);

  if (!savedItem) throw new ApiError(404, 'Saved item not found');

  cart.items.push({ product: savedItem.product, quantity: 1, variant: savedItem.variant });
  cart.savedForLater = cart.savedForLater.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();

  const updatedCart = await getOrCreateCart(req.user._id);
  res.json(new ApiResponse(200, {
    items: updatedCart.items,
    savedForLater: updatedCart.savedForLater,
  }, 'Moved to cart'));
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const Coupon = (await import('../models/Coupon.js')).default;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code');

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) throw new ApiError(400, 'Coupon expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');

  const cart = await getOrCreateCart(req.user._id);
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product?.price?.current || 0) * item.quantity, 0
  );

  if (subtotal < coupon.minPurchase) {
    throw new ApiError(400, `Minimum purchase of ₹${coupon.minPurchase} required`);
  }

  const discount = coupon.applyCoupon(subtotal);
  cart.couponApplied = { code: coupon.code, discount, type: coupon.type };
  await cart.save();

  res.json(new ApiResponse(200, {
    coupon: { code: coupon.code, discount, type: coupon.type },
    subtotal,
    total: subtotal - discount,
  }, 'Coupon applied'));
});

export const removeCoupon = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { $unset: { couponApplied: 1 } });
  res.json(new ApiResponse(200, null, 'Coupon removed'));
});

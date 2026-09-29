import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate({ path: 'items.product', select: 'title slug images price ratings stock isActive' })
    .lean();

  if (!wishlist) wishlist = { items: [] };

  const activeItems = wishlist.items.filter((item) => item.product?.isActive);

  res.json(new ApiResponse(200, {
    items: activeItems,
    total: activeItems.length,
  }));
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw ApiError.productNotFound();

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

  wishlist.addToWishlist(productId, product.price.current);
  await wishlist.save();

  await Product.findByIdAndUpdate(productId, { $inc: { wishlistCount: 1 } });

  res.json(new ApiResponse(200, null, 'Added to wishlist'));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  const existed = wishlist.isInWishlist(req.params.productId);
  wishlist.removeFromWishlist(req.params.productId);
  await wishlist.save();

  if (existed) {
    await Product.findByIdAndUpdate(req.params.productId, { $inc: { wishlistCount: -1 } });
  }

  res.json(new ApiResponse(200, null, 'Removed from wishlist'));
});

export const moveToCartFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const Cart = (await import('../models/Cart.js')).default;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist || !wishlist.isInWishlist(productId)) {
    throw new ApiError(404, 'Item not in wishlist');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  cart.addItem(productId);
  await cart.save();

  wishlist.removeFromWishlist(productId);
  await wishlist.save();

  res.json(new ApiResponse(200, null, 'Moved to cart'));
});

export const checkWishlistStatus = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  const isInWishlist = wishlist ? wishlist.isInWishlist(req.params.productId) : false;
  res.json(new ApiResponse(200, { isInWishlist }));
});

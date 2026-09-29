import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  priceWhenAdded: {
    type: Number,
  },
  notes: {
    type: String,
    maxlength: 200,
  },
}, { _id: true });

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [wishlistItemSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

wishlistSchema.index({ 'items.product': 1 });

// Virtual: Item count
wishlistSchema.virtual('itemCount').get(function () {
  return this.items?.length || 0;
});

// Method: Add to wishlist
wishlistSchema.methods.addToWishlist = function (productId, price) {
  const exists = this.items.some(
    (item) => item.product.toString() === productId.toString()
  );
  if (!exists) {
    this.items.push({
      product: productId,
      priceWhenAdded: price,
    });
  }
};

// Method: Remove from wishlist
wishlistSchema.methods.removeFromWishlist = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
};

// Method: Check if in wishlist
wishlistSchema.methods.isInWishlist = function (productId) {
  return this.items.some(
    (item) => item.product.toString() === productId.toString()
  );
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;

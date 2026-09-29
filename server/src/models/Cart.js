import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Cannot add more than 10 of the same item'],
    default: 1,
  },
  variant: {
    name: String,
    value: String,
    optionId: mongoose.Schema.Types.ObjectId,
    sku: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const savedItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    name: String,
    value: String,
    optionId: mongoose.Schema.Types.ObjectId,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
  priceWhenSaved: {
    type: Number,
  },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  savedForLater: [savedItemSchema],
  couponApplied: {
    code: String,
    discount: Number,
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: Total items
cartSchema.virtual('totalItems').get(function () {
  return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
});

// Virtual: Subtotal
cartSchema.virtual('subtotal').get(function () {
  return this.items?.reduce((sum, item) => {
    const price = item.product?.price?.current || 0;
    return sum + price * item.quantity;
  }, 0) || 0;
});

// Method: Add item
cartSchema.methods.addItem = function (productId, quantity = 1, variant = null) {
  const existingIndex = this.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingIndex > -1) {
    this.items[existingIndex].quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity, variant });
  }
};

// Method: Remove item
cartSchema.methods.removeItem = function (itemId) {
  this.items = this.items.filter(
    (item) => item._id.toString() !== itemId.toString()
  );
};

// Method: Save for later
cartSchema.methods.saveForLater = function (itemId) {
  const item = this.items.find(
    (i) => i._id.toString() === itemId.toString()
  );
  if (item) {
    this.savedForLater.push({
      product: item.product,
      variant: item.variant,
      priceWhenSaved: item.product?.price?.current,
    });
    this.removeItem(itemId);
  }
};

// Method: Move to cart
cartSchema.methods.moveToCart = function (savedItemId) {
  const savedItem = this.savedForLater.find(
    (i) => i._id.toString() === savedItemId.toString()
  );
  if (savedItem) {
    this.addItem(savedItem.product, 1, savedItem.variant);
    this.savedForLater = this.savedForLater.filter(
      (i) => i._id.toString() !== savedItemId.toString()
    );
  }
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

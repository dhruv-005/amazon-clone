import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    name: String,
    value: String,
    sku: String,
  },
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'processing', 'shipped',
      'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded',
    ],
    default: 'pending',
  },
  trackingNumber: { type: String },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
}, { _id: true });

const trackingUpdateSchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    alternatePhone: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    addressType: { type: String, enum: ['home', 'work', 'other'] },
  },
  billingAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  payment: {
    method: {
      type: String,
      enum: ['cod'],
      default: 'cod',
    },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    paidAt: { type: Date },
    gateway: { type: String, enum: ['cod'], default: 'cod' },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed },
  },
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true },
    savings: { type: Number, default: 0 },
  },
  tracking: {
    carrier: { type: String },
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    updates: [trackingUpdateSchema],
  },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  notes: { type: String },
  isGift: { type: Boolean, default: false },
  giftMessage: { type: String },
  giftWrap: { type: Boolean, default: false },
  invoiceUrl: { type: String },
  status: {
    type: String,
    enum: [
      'placed', 'confirmed', 'processing', 'shipped',
      'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded',
    ],
    default: 'placed',
  },
  isPrimeOrder: { type: Boolean, default: false },
  cancellationReason: { type: String },
  cancelledBy: { type: String, enum: ['user', 'seller', 'admin', 'system'] },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.seller': 1, status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ estimatedDelivery: 1 });

// Pre-save: Generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Virtual: Item count
orderSchema.virtual('itemCount').get(function () {
  return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
});

// Virtual: Is cancellable
orderSchema.virtual('isCancellable').get(function () {
  return ['placed', 'confirmed', 'processing'].includes(this.status);
});

// Virtual: Is returnable
orderSchema.virtual('isReturnable').get(function () {
  if (this.status !== 'delivered') return false;
  const daysSinceDelivery = (Date.now() - this.deliveredAt) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 10;
});

// Method: Update status
orderSchema.methods.updateStatus = function (newStatus, trackingInfo = null) {
  this.status = newStatus;

  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
    this.items.forEach((item) => {
      item.status = 'delivered';
      item.deliveredAt = new Date();
    });
  }

  if (newStatus === 'cancelled') {
    this.items.forEach((item) => {
      if (item.status !== 'delivered') {
        item.status = 'cancelled';
        item.cancelledAt = new Date();
      }
    });
  }

  if (trackingInfo) {
    this.tracking.updates.push(trackingInfo);
  }
};

const Order = mongoose.model('Order', orderSchema);
export default Order;

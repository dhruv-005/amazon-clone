import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_one_get_one'],
    required: true,
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: 0,
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxDiscount: {
    type: Number,
    min: 0,
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1,
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPrimeOnly: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  usedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    usedAt: { type: Date, default: Date.now },
    discountAmount: { type: Number },
  }],
}, {
  timestamps: true,
});

couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
couponSchema.index({ type: 1 });

// Virtual: Is valid
couponSchema.virtual('isValid').get(function () {
  const now = new Date();
  const isWithinDate = now >= this.startDate && now <= this.endDate;
  const hasUsageLeft = !this.usageLimit || this.usedCount < this.usageLimit;
  return this.isActive && isWithinDate && hasUsageLeft;
});

// Method: Apply coupon
couponSchema.methods.applyCoupon = function (subtotal) {
  if (!this.isValid) throw new Error('Coupon is not valid');
  if (subtotal < this.minPurchase) {
    throw new Error(`Minimum purchase of ₹${this.minPurchase} required`);
  }

  let discount = 0;

  switch (this.type) {
    case 'percentage':
      discount = (subtotal * this.value) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;
    case 'fixed':
      discount = Math.min(this.value, subtotal);
      break;
    case 'free_shipping':
      discount = 0;
      break;
    default:
      discount = 0;
  }

  return Math.round(discount * 100) / 100;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;

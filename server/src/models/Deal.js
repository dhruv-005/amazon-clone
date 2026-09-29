import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: { type: String },
  type: {
    type: String,
    enum: ['lightning', 'daily', 'clearance', 'prime_exclusive', 'festive', 'flash'],
    required: true,
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    dealPrice: { type: Number, required: true },
    originalPrice: { type: Number },
    maxQuantity: { type: Number, default: 100 },
    claimedQuantity: { type: Number, default: 0 },
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  banner: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  isPrimeOnly: { type: Boolean, default: false },
  minDiscount: { type: Number, default: 10 },
  maxDiscount: { type: Number },
  totalViews: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

dealSchema.index({ type: 1, isActive: 1 });
dealSchema.index({ startDate: 1, endDate: 1 });
dealSchema.index({ 'products.product': 1 });

dealSchema.virtual('isLive').get(function () {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

dealSchema.virtual('timeRemaining').get(function () {
  if (!this.isLive) return 0;
  return this.endDate - new Date();
});

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;

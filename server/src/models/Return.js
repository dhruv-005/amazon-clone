import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  orderItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  reason: {
    type: String,
    enum: [
      'defective', 'wrong_item', 'not_as_described',
      'size_too_small', 'size_too_large', 'quality_issue',
      'no_longer_needed', 'better_price', 'arrived_late', 'other',
    ],
    required: true,
  },
  reasonDescription: {
    type: String,
    maxlength: 1000,
  },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'pickup_scheduled', 'picked_up', 'received', 'refunded', 'completed'],
    default: 'requested',
  },
  refundType: {
    type: String,
    enum: ['original_payment', 'wallet', 'replacement'],
    default: 'original_payment',
  },
  refundAmount: { type: Number },
  pickupDate: { type: Date },
  pickupAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    city: String,
    state: String,
    pincode: String,
  },
  trackingNumber: { type: String },
  adminNotes: { type: String },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  processedAt: { type: Date },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

returnSchema.index({ order: 1 });
returnSchema.index({ user: 1, createdAt: -1 });
returnSchema.index({ status: 1 });

const Return = mongoose.model('Return', returnSchema);
export default Return;

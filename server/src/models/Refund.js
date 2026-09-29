import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  returnRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Return',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  refundId: {
    type: String,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: { type: String, default: 'INR' },
  reason: { type: String, required: true },
  method: {
    type: String,
    enum: ['original_payment', 'wallet', 'bank_transfer', 'upi'],
    default: 'original_payment',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  gatewayRefundId: { type: String },
  processedAt: { type: Date },
  completedAt: { type: Date },
  failureReason: { type: String },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: { type: String },
}, {
  timestamps: true,
});

refundSchema.index({ refundId: 1 });
refundSchema.index({ order: 1 });
refundSchema.index({ status: 1 });

refundSchema.pre('save', async function (next) {
  if (this.isNew && !this.refundId) {
    this.refundId = `REF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

const Refund = mongoose.model('Refund', refundSchema);
export default Refund;

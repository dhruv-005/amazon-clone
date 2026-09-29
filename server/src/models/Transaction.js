import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  gateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'cod', 'wallet'],
    required: true,
  },
  gatewayTransactionId: { type: String },
  type: {
    type: String,
    enum: ['payment', 'refund', 'payout', 'commission', 'adjustment'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet', 'emi'],
  },
  description: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  failureReason: { type: String },
  refundAmount: { type: Number, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  sellerPayout: { type: Number, default: 0 },
  processedAt: { type: Date },
}, {
  timestamps: true,
});

transactionSchema.index({ order: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ seller: 1, type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ gateway: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;

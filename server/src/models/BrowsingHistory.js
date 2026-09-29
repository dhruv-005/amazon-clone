import mongoose from 'mongoose';

const browsingHistorySchema = new mongoose.Schema({
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
  viewedAt: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number,
    default: 0,
  },
  source: {
    type: String,
    enum: ['search', 'category', 'recommendation', 'direct', 'cart', 'wishlist'],
  },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
  },
}, {
  timestamps: false,
});

browsingHistorySchema.index({ user: 1, viewedAt: -1 });
browsingHistorySchema.index({ product: 1 });
browsingHistorySchema.index({ viewedAt: -1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

const BrowsingHistory = mongoose.model('BrowsingHistory', browsingHistorySchema);
export default BrowsingHistory;

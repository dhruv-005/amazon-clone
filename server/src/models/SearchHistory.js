import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
  },
  resultCount: { type: Number, default: 0 },
  clickedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
  },
  ipAddress: { type: String },
}, {
  timestamps: true,
});

searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ query: 1 });
searchHistorySchema.index({ createdAt: -1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;

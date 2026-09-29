import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [5000, 'Review cannot exceed 5000 characters'],
  },
  images: [{
    url: String,
    publicId: String,
  }],
  videos: [{
    url: String,
    thumbnail: String,
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpfulVotes: {
    type: Number,
    default: 0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  reportCount: {
    type: Number,
    default: 0,
  },
  sellerResponse: {
    comment: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Compound index: One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerifiedPurchase: 1 });
reviewSchema.index({ helpfulVotes: -1 });

// Virtual: Helpful percentage
reviewSchema.virtual('helpfulPercentage').get(function () {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / this.totalVotes) * 100);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

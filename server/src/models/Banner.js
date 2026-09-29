import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: { type: String },
  description: { type: String },
  image: {
    url: { type: String, required: true },
    mobileUrl: { type: String },
    alt: { type: String },
    publicId: { type: String },
  },
  link: {
    type: String,
    required: true,
  },
  linkType: {
    type: String,
    enum: ['product', 'category', 'deal', 'page', 'external'],
    default: 'page',
  },
  position: {
    type: String,
    enum: ['hero', 'top', 'middle', 'bottom', 'sidebar', 'popup'],
    default: 'hero',
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  targetAudience: {
    type: String,
    enum: ['all', 'prime', 'new_users', 'returning'],
    default: 'all',
  },
  backgroundColor: { type: String },
  textColor: { type: String },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

bannerSchema.index({ position: 1, isActive: 1, order: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;

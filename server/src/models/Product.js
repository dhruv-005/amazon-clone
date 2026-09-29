import mongoose from 'mongoose';

const variantOptionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  price: { type: Number },
  stock: { type: Number, default: 0 },
  sku: { type: String },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
}, { _id: true });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [variantOptionSchema],
}, { _id: true });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String },
  publicId: { type: String },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { _id: true });

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const ratingDistributionSchema = new mongoose.Schema({
  1: { type: Number, default: 0 },
  2: { type: Number, default: 0 },
  3: { type: Number, default: 0 },
  4: { type: Number, default: 0 },
  5: { type: Number, default: 0 },
}, { _id: false });

const dealInfoSchema = new mongoose.Schema({
  isDeal: { type: Boolean, default: false },
  dealPrice: { type: Number },
  dealStart: { type: Date },
  dealEnd: { type: Date },
  dealType: {
    type: String,
    enum: ['lightning', 'daily', 'clearance', 'prime_exclusive', 'festive'],
  },
  claimedPercentage: { type: Number, default: 0 },
  maxClaimed: { type: Number, default: 100 },
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  isFreeShipping: { type: Boolean, default: false },
  shippingCost: { type: Number, default: 0 },
  estimatedDays: { type: Number, default: 3 },
  weight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  isPrimeEligible: { type: Boolean, default: false },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
  },
  richDescription: {
    type: String,
  },
  bulletPoints: [{
    type: String,
    trim: true,
  }],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  brandName: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    original: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Price cannot be negative'],
    },
    current: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  variants: [variantSchema],
  images: [imageSchema],
  videos: [{
    url: String,
    thumbnail: String,
    title: String,
  }],
  specifications: [specificationSchema],
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  weight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' },
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    distribution: {
      type: ratingDistributionSchema,
      default: () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }),
    },
  },
  tags: [{ type: String, lowercase: true, trim: true }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  dealInfo: { type: dealInfoSchema, default: () => ({}) },
  shipping: { type: shippingSchema, default: () => ({}) },
  warranty: { type: String },
  returnPolicy: {
    type: String,
    default: '10 days return policy',
  },
  gstRate: {
    type: Number,
    default: 18,
    enum: [0, 5, 12, 18, 28],
  },
  totalSold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  condition: {
    type: String,
    enum: ['new', 'used_like_new', 'used_good', 'used_acceptable', 'refurbished'],
    default: 'new',
  },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ 'price.current': 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text', brandName: 'text' });

// Pre-save: Calculate discount
productSchema.pre('save', function (next) {
  if (this.price.original > 0 && this.price.current < this.price.original) {
    this.price.discount = Math.round(
      ((this.price.original - this.price.current) / this.price.original) * 100
    );
  } else {
    this.price.discount = 0;
  }
  next();
});

// Virtual: Primary image
productSchema.virtual('primaryImage').get(function () {
  const primary = this.images?.find((img) => img.isPrimary);
  return primary ? primary.url : this.images?.[0]?.url || null;
});

// Virtual: Is in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Virtual: Is deal active
productSchema.virtual('isDealActive').get(function () {
  if (!this.dealInfo?.isDeal) return false;
  const now = new Date();
  return now >= this.dealInfo.dealStart && now <= this.dealInfo.dealEnd;
});

// Method: Update rating
productSchema.methods.updateRating = function (newRating, oldRating = null) {
  const totalReviews = this.ratings.count;

  if (oldRating !== null) {
    this.ratings.distribution[oldRating] = Math.max(
      0, (this.ratings.distribution[oldRating] || 0) - 1
    );
  }

  this.ratings.distribution[newRating] = (this.ratings.distribution[newRating] || 0) + 1;

  if (oldRating === null) {
    this.ratings.count += 1;
  }

  let totalStars = 0;
  let totalCount = 0;
  for (let i = 1; i <= 5; i++) {
    totalStars += i * (this.ratings.distribution[i] || 0);
    totalCount += this.ratings.distribution[i] || 0;
  }

  this.ratings.average = totalCount > 0
    ? Math.round((totalStars / totalCount) * 10) / 10
    : 0;
  this.ratings.count = totalCount;
};

// Method: Decrease stock
productSchema.methods.decreaseStock = function (quantity) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.stock -= quantity;
  this.totalSold += quantity;
};

const Product = mongoose.model('Product', productSchema);
export default Product;

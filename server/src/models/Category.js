import mongoose from 'mongoose';

const filterOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['range', 'checkbox', 'radio', 'color', 'size'],
    default: 'checkbox',
  },
  options: [{ type: String }],
  min: { type: Number },
  max: { type: Number },
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
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
    trim: true,
  },
  image: {
    type: String,
  },
  icon: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  level: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  filters: [filterOptionSchema],
  productCount: {
    type: Number,
    default: 0,
  },
  metaTitle: { type: String },
  metaDescription: { type: String },
  bannerImage: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1, isActive: 1 });
categorySchema.index({ order: 1 });

// Virtual: Children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Virtual: Parent category
categorySchema.virtual('parentCategory', {
  ref: 'Category',
  localField: 'parent',
  foreignField: '_id',
  justOne: true,
});

// Virtual: Has children
categorySchema.virtual('hasChildren').get(function () {
  return this.productCount > 0;
});

// Pre-save: Auto-generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;

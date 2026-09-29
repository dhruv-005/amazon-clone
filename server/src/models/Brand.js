import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  country: { type: String },
  foundedYear: { type: Number },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  productCount: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, {
  timestamps: true,
});

brandSchema.index({ name: 'text' });
brandSchema.index({ isActive: 1, isFeatured: 1 });

brandSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;

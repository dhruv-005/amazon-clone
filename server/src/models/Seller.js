import mongoose from 'mongoose';

const bankDetailsSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branchName: { type: String },
}, { _id: false });

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['individual', 'proprietorship', 'partnership', 'private_limited', 'llp', 'other'],
    default: 'individual',
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  logo: { type: String },
  banner: { type: String },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  cinNumber: { type: String },
  bankDetails: { type: bankDetailsSchema },
  businessAddress: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
  pickupAddress: {
    addressLine1: String,
    city: String,
    state: String,
    pincode: String,
    contactPerson: String,
    contactPhone: String,
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  commission: { type: Number, default: 15, min: 0, max: 100 },
  totalProducts: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  pendingPayout: { type: Number, default: 0 },
  documents: [{
    type: { type: String, enum: ['gst', 'pan', 'aadhar', 'bank_statement', 'other'] },
    url: String,
    isVerified: { type: Boolean, default: false },
  }],
  storeUrl: { type: String },
  responseTime: { type: Number, default: 24 },
  cancellationRate: { type: Number, default: 0 },
  lateShipmentRate: { type: Number, default: 0 },
  verifiedAt: { type: Date },
  suspendedAt: { type: Date },
  suspensionReason: { type: String },
}, {
  timestamps: true,
});

sellerSchema.index({ businessName: 'text' });
sellerSchema.index({ isVerified: 1, isActive: 1 });
sellerSchema.index({ 'ratings.average': -1 });

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;

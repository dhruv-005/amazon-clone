import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/index.js';

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true },
  alternatePhone: { type: String },
  addressLine1: { type: String, required: true, trim: true },
  addressLine2: { type: String, trim: true },
  landmark: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  country: { type: String, default: 'India', trim: true },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home',
  },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const oauthProviderSchema = new mongoose.Schema({
  provider: { type: String, enum: ['google', 'facebook', 'apple'] },
  providerId: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/default-avatar.png',
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPrime: {
    type: Boolean,
    default: false,
  },
  primeExpiry: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  addresses: [addressSchema],
  defaultAddress: {
    type: mongoose.Schema.Types.ObjectId,
  },
  otp: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  oauthProviders: [oauthProviderSchema],
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
    newsletter: { type: Boolean, default: true },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true },
      deals: { type: Boolean, default: true },
    },
  },
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
  }],
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isPrime: 1 });
userSchema.index({ resetPasswordToken: 1 });

// Virtual: Full address count
userSchema.virtual('addressCount').get(function () {
  return this.addresses?.length || 0;
});

// Pre-save: Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method: Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiry }
  );
};

// Method: Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );
};

// Method: Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    attempts: 0,
  };
  return otp;
};

// Method: Verify OTP
userSchema.methods.verifyOTP = function (inputOTP) {
  if (!this.otp || !this.otp.code) return false;
  if (this.otp.expiresAt < new Date()) return false;
  if (this.otp.attempts >= 3) return false;
  this.otp.attempts += 1;
  return this.otp.code === inputOTP;
};

// Method: Generate password reset token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  return resetToken;
};

// Method: Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
};

// Method: Check if Prime is active
userSchema.methods.isPrimeActive = function () {
  return this.isPrime && this.primeExpiry && this.primeExpiry > new Date();
};

const User = mongoose.model('User', userSchema);
export default User;

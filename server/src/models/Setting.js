import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Setting key is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'object', 'array', 'json'],
    default: 'string',
  },
  category: {
    type: String,
    enum: [
      'general', 'seo', 'email', 'payment', 'shipping',
      'tax', 'security', 'notification', 'appearance',
      'social', 'analytics', 'maintenance',
    ],
    default: 'general',
  },
  description: {
    type: String,
    trim: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
settingSchema.index({ category: 1 });

// Static: Get setting by key
settingSchema.statics.getByKey = async function (key) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

// Static: Set setting by key
settingSchema.statics.setByKey = async function (key, value, updatedBy = null) {
  const setting = await this.findOneAndUpdate(
    { key },
    {
      value,
      updatedBy,
      $setOnInsert: { key, type: typeof value },
    },
    { upsert: true, new: true }
  );
  return setting;
};

// Static: Get all settings by category
settingSchema.statics.getByCategory = async function (category) {
  const settings = await this.find({ category }).lean();
  const result = {};
  settings.forEach((s) => {
    result[s.key] = s.value;
  });
  return result;
};

// Static: Get all public settings
settingSchema.statics.getPublicSettings = async function () {
  const settings = await this.find({ isPublic: true }).lean();
  const result = {};
  settings.forEach((s) => {
    result[s.key] = s.value;
  });
  return result;
};

// Static: Bulk update settings
settingSchema.statics.bulkUpdate = async function (settingsObj, updatedBy = null) {
  const operations = Object.entries(settingsObj).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { value, updatedBy, updatedAt: new Date() },
      upsert: true,
    },
  }));

  return this.bulkWrite(operations);
};

// Pre-seed default settings (run once)
settingSchema.statics.seedDefaults = async function () {
  const defaults = [
    {
      key: 'site_name',
      value: 'Amazon Clone',
      type: 'string',
      category: 'general',
      description: 'Website name',
      isPublic: true,
    },
    {
      key: 'site_logo',
      value: '/images/logo/amazon-logo.png',
      type: 'string',
      category: 'general',
      description: 'Website logo URL',
      isPublic: true,
    },
    {
      key: 'site_description',
      value: 'Your one-stop shop for everything',
      type: 'string',
      category: 'seo',
      description: 'Meta description for SEO',
      isPublic: true,
    },
    {
      key: 'currency',
      value: 'INR',
      type: 'string',
      category: 'general',
      description: 'Default currency',
      isPublic: true,
    },
    {
      key: 'currency_symbol',
      value: '₹',
      type: 'string',
      category: 'general',
      description: 'Currency symbol',
      isPublic: true,
    },
    {
      key: 'tax_rate',
      value: 18,
      type: 'number',
      category: 'tax',
      description: 'Default GST rate percentage',
    },
    {
      key: 'free_shipping_threshold',
      value: 499,
      type: 'number',
      category: 'shipping',
      description: 'Minimum order for free shipping',
      isPublic: true,
    },
    {
      key: 'default_shipping_cost',
      value: 40,
      type: 'number',
      category: 'shipping',
      description: 'Default shipping cost',
      isPublic: true,
    },
    {
      key: 'allow_cod',
      value: true,
      type: 'boolean',
      category: 'payment',
      description: 'Allow Cash on Delivery',
    },
    {
      key: 'min_order_amount',
      value: 100,
      type: 'number',
      category: 'payment',
      description: 'Minimum order amount',
      isPublic: true,
    },
    {
      key: 'max_order_amount',
      value: 500000,
      type: 'number',
      category: 'payment',
      description: 'Maximum order amount',
    },
    {
      key: 'return_window_days',
      value: 10,
      type: 'number',
      category: 'general',
      description: 'Return window in days',
      isPublic: true,
    },
    {
      key: 'maintenance_mode',
      value: false,
      type: 'boolean',
      category: 'maintenance',
      description: 'Enable maintenance mode',
    },
    {
      key: 'maintenance_message',
      value: 'We are under maintenance. Please check back soon.',
      type: 'string',
      category: 'maintenance',
      description: 'Maintenance mode message',
      isPublic: true,
    },
    {
      key: 'allow_registration',
      value: true,
      type: 'boolean',
      category: 'security',
      description: 'Allow new user registration',
    },
    {
      key: 'require_email_verification',
      value: true,
      type: 'boolean',
      category: 'security',
      description: 'Require email verification for new accounts',
    },
    {
      key: 'max_login_attempts',
      value: 5,
      type: 'number',
      category: 'security',
      description: 'Max login attempts before lockout',
    },
    {
      key: 'lockout_duration_minutes',
      value: 30,
      type: 'number',
      category: 'security',
      description: 'Account lockout duration in minutes',
    },
    {
      key: 'products_per_page',
      value: 24,
      type: 'number',
      category: 'general',
      description: 'Default products per page',
      isPublic: true,
    },
    {
      key: 'enable_reviews',
      value: true,
      type: 'boolean',
      category: 'general',
      description: 'Enable product reviews',
      isPublic: true,
    },
    {
      key: 'enable_wishlist',
      value: true,
      type: 'boolean',
      category: 'general',
      description: 'Enable wishlist feature',
      isPublic: true,
    },
    {
      key: 'enable_prime',
      value: true,
      type: 'boolean',
      category: 'general',
      description: 'Enable Prime membership',
      isPublic: true,
    },
    {
      key: 'prime_monthly_price',
      value: 129,
      type: 'number',
      category: 'payment',
      description: 'Prime monthly subscription price',
      isPublic: true,
    },
    {
      key: 'prime_yearly_price',
      value: 1499,
      type: 'number',
      category: 'payment',
      description: 'Prime yearly subscription price',
      isPublic: true,
    },
    {
      key: 'contact_email',
      value: 'support@amazonclone.com',
      type: 'string',
      category: 'general',
      description: 'Contact email address',
      isPublic: true,
    },
    {
      key: 'contact_phone',
      value: '1800-XXX-XXXX',
      type: 'string',
      category: 'general',
      description: 'Contact phone number',
      isPublic: true,
    },
    {
      key: 'social_links',
      value: {
        facebook: 'https://facebook.com/amazonclone',
        twitter: 'https://twitter.com/amazonclone',
        instagram: 'https://instagram.com/amazonclone',
        youtube: 'https://youtube.com/amazonclone',
      },
      type: 'object',
      category: 'social',
      description: 'Social media links',
      isPublic: true,
    },
    {
      key: 'enable_chat_support',
      value: true,
      type: 'boolean',
      category: 'notification',
      description: 'Enable live chat support',
      isPublic: true,
    },
    {
      key: 'default_commission_rate',
      value: 15,
      type: 'number',
      category: 'payment',
      description: 'Default seller commission percentage',
    },
  ];

  for (const setting of defaults) {
    await this.findOneAndUpdate(
      { key: setting.key },
      { $setOnInsert: setting },
      { upsert: true }
    );
  }

  return defaults.length;
};

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['product', 'review', 'seller', 'user', 'question', 'answer', 'message'],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel',
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['Product', 'Review', 'User', 'Question', 'Message'],
  },
  reason: {
    type: String,
    enum: [
      'inappropriate_content',
      'spam',
      'fake_review',
      'counterfeit_product',
      'misleading_information',
      'offensive_language',
      'copyright_violation',
      'safety_concern',
      'pricing_issue',
      'harassment',
      'fraud',
      'other',
    ],
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  images: [{
    url: String,
    publicId: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed', 'action_taken'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolution: {
    action: {
      type: String,
      enum: [
        'content_removed',
        'user_warned',
        'user_suspended',
        'user_banned',
        'product_removed',
        'seller_suspended',
        'no_action',
        'other',
      ],
    },
    notes: { type: String },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: { type: Date },
  },
  history: [{
    action: { type: String },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: { type: String },
    timestamp: { type: Date, default: Date.now },
  }],
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  duplicateCount: {
    type: Number,
    default: 1,
  },
  duplicateReporters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Indexes
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1, priority: 1 });
reportSchema.index({ assignedTo: 1, status: 1 });
reportSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reports from same user
reportSchema.index(
  { reporter: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

// Method: Add to history
reportSchema.methods.addToHistory = function (action, performedBy, notes) {
  this.history.push({ action, performedBy, notes });
};

// Method: Resolve report
reportSchema.methods.resolve = function (action, notes, resolvedBy) {
  this.status = 'resolved';
  this.resolution = {
    action,
    notes,
    resolvedBy,
    resolvedAt: new Date(),
  };
  this.addToHistory('resolved', resolvedBy, notes);
};

// Method: Dismiss report
reportSchema.methods.dismiss = function (notes, resolvedBy) {
  this.status = 'dismissed';
  this.resolution = {
    action: 'no_action',
    notes,
    resolvedBy,
    resolvedAt: new Date(),
  };
  this.addToHistory('dismissed', resolvedBy, notes);
};

const Report = mongoose.model('Report', reportSchema);
export default Report;

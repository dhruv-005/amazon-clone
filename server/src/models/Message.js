import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String },
  name: { type: String },
  type: {
    type: String,
    enum: ['image', 'document', 'video', 'audio'],
    default: 'image',
  },
  mimeType: { type: String },
  size: { type: Number },
}, { _id: true });

const readReceiptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderAvatar: {
    type: String,
  },
  senderRole: {
    type: String,
    enum: ['customer', 'seller', 'support', 'admin', 'system'],
    required: true,
  },
  text: {
    type: String,
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters'],
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'video', 'audio', 'system', 'order_update'],
    default: 'text',
  },
  attachments: [attachmentSchema],
  replyTo: {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    text: { type: String },
    senderName: { type: String },
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  readBy: [readReceiptSchema],
  isRead: {
    type: Boolean,
    default: false,
  },
  metadata: {
    orderNumber: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    trackingNumber: { type: String },
    statusUpdate: { type: String },
  },
  ipAddress: { type: String },
  userAgent: { type: String },
}, {
  timestamps: true,
});

// Indexes
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ isDeleted: 1 });
messageSchema.index({ chat: 1, isDeleted: 1, createdAt: -1 });

// Virtual: Has attachments
messageSchema.virtual('hasAttachments').get(function () {
  return this.attachments && this.attachments.length > 0;
});

// Virtual: Read count
messageSchema.virtual('readCount').get(function () {
  return this.readBy?.length || 0;
});

// Method: Soft delete
messageSchema.methods.softDelete = function (userId) {
  this.deletedFor.push(userId);
  if (this.deletedFor.length >= 2) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.text = 'This message was deleted';
    this.attachments = [];
  }
};

// Method: Edit message
messageSchema.methods.editMessage = function (newText) {
  this.text = newText;
  this.isEdited = true;
  this.editedAt = new Date();
};

// Method: Mark as read
messageSchema.methods.markAsRead = function (userId) {
  const alreadyRead = this.readBy.some(
    (r) => r.user.toString() === userId.toString()
  );
  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
    this.isRead = true;
  }
};

const Message = mongoose.model('Message', messageSchema);
export default Message;

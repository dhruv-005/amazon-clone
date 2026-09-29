import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'support', 'admin'],
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  leftAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastReadMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['customer_seller', 'customer_support', 'group'],
    required: true,
    default: 'customer_support',
  },
  participants: [participantSchema],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  lastMessage: {
    text: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
    createdAt: { type: Date },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  tags: [{
    type: String,
    enum: ['order_issue', 'refund', 'product_query', 'shipping', 'account', 'technical', 'other'],
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'email', 'phone'],
      default: 'web',
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  totalMessages: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
chatSchema.index({ 'participants.user': 1, isActive: 1 });
chatSchema.index({ type: 1, isActive: 1 });
chatSchema.index({ order: 1 });
chatSchema.index({ isResolved: 1, priority: 1 });
chatSchema.index({ assignedTo: 1, isResolved: 1 });
chatSchema.index({ updatedAt: -1 });
chatSchema.index({ 'lastMessage.createdAt': -1 });

// Virtual: Get other participant
chatSchema.virtual('otherParticipant').get(function () {
  if (this.participants.length < 2) return null;
  return this.participants[1];
});

// Method: Add participant
chatSchema.methods.addParticipant = function (userId, role) {
  const exists = this.participants.some(
    (p) => p.user.toString() === userId.toString()
  );
  if (!exists) {
    this.participants.push({ user: userId, role });
  }
};

// Method: Remove participant
chatSchema.methods.removeParticipant = function (userId) {
  const participant = this.participants.find(
    (p) => p.user.toString() === userId.toString()
  );
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
  }
};

// Method: Update last message
chatSchema.methods.updateLastMessage = function (message) {
  this.lastMessage = {
    text: message.text,
    sender: message.sender,
    senderName: message.senderName,
    type: message.type || 'text',
    createdAt: message.createdAt || new Date(),
  };
  this.totalMessages += 1;

  // Increment unread for other participants
  this.participants.forEach((p) => {
    if (p.user.toString() !== message.sender.toString() && p.isActive) {
      p.unreadCount += 1;
    }
  });
};

// Method: Mark as read for user
chatSchema.methods.markAsRead = function (userId, messageId) {
  const participant = this.participants.find(
    (p) => p.user.toString() === userId.toString()
  );
  if (participant) {
    participant.unreadCount = 0;
    participant.lastReadMessage = messageId;
  }
};

// Method: Resolve chat
chatSchema.methods.resolve = function (resolvedBy) {
  this.isResolved = true;
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
};

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;

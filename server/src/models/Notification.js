import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'order_placed', 'order_shipped', 'order_delivered',
      'order_cancelled', 'order_returned', 'price_drop',
      'deal_alert', 'review_reminder', 'back_in_stock',
      'system', 'promotion', 'seller_message', 'refund_processed',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    link: { type: String },
    image: { type: String },
    extra: { type: mongoose.Schema.Types.Mixed },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: { type: Date },
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
  },
  isSent: {
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
  },
  expiresAt: { type: Date },
}, {
  timestamps: true,
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method: Mark as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

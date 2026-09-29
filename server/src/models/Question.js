import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
  isSellerAnswer: {
    type: Boolean,
    default: false,
  },
  helpfulVotes: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters'],
    maxlength: [500, 'Question cannot exceed 500 characters'],
  },
  answers: [answerSchema],
  isAnswered: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  helpfulVotes: { type: Number, default: 0 },
}, {
  timestamps: true,
});

questionSchema.index({ product: 1, isApproved: 1, createdAt: -1 });
questionSchema.index({ isAnswered: 1 });

const Question = mongoose.model('Question', questionSchema);
export default Question;

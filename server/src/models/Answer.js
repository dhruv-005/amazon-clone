import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Answer text is required'],
    trim: true,
    minlength: [5, 'Answer must be at least 5 characters'],
    maxlength: [2000, 'Answer cannot exceed 2000 characters'],
  },
  isSellerAnswer: {
    type: Boolean,
    default: false,
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpfulVotes: {
    type: Number,
    default: 0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  reportedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  reportCount: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
answerSchema.index({ question: 1, isApproved: 1, createdAt: -1 });
answerSchema.index({ helpfulVotes: -1 });

// Virtual: Helpful percentage
answerSchema.virtual('helpfulPercentage').get(function () {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / this.totalVotes) * 100);
});

// Method: Toggle helpful vote
answerSchema.methods.toggleHelpful = function (userId) {
  const alreadyVoted = this.helpfulUsers.some(
    (id) => id.toString() === userId.toString()
  );

  if (alreadyVoted) {
    this.helpfulUsers = this.helpfulUsers.filter(
      (id) => id.toString() !== userId.toString()
    );
    this.helpfulVotes = Math.max(0, this.helpfulVotes - 1);
  } else {
    this.helpfulUsers.push(userId);
    this.helpfulVotes += 1;
  }

  this.totalVotes += 1;
};

// Method: Report answer
answerSchema.methods.report = function (userId) {
  if (!this.reportedBy.some((id) => id.toString() === userId.toString())) {
    this.reportedBy.push(userId);
    this.reportCount += 1;
  }
};

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;

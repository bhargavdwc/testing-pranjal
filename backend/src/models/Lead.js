import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    // Form submission data
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },

    // Funnel status
    status: {
      type: String,
      enum: ['NEW', 'QUALIFIED', 'NOT_QUALIFIED', 'OPPORTUNITY', 'CONVERTED'],
      default: 'NEW',
    },

    // Admin notes
    notes: {
      type: String,
      default: '',
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'RECEIVED'],
      default: 'PENDING',
    },

    // Onboarding flags
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },

    // Soft delete timestamp
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', company: 'text', role: 'text', phone: 'text' });

// Soft Delete Hooks
leadSchema.pre(/^find/, function (next) {
  if (this.getFilter().deletedAt !== undefined) return next(); // allow querying deleted if explicitly asked
  this.find({ deletedAt: null });
  next();
});

leadSchema.pre('countDocuments', function (next) {
  if (this.getFilter().deletedAt !== undefined) return next();
  this.where({ deletedAt: null });
  next();
});

leadSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { deletedAt: null } });
  next();
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;

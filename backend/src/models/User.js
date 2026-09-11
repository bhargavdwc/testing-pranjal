import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
      email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin'],
      default: 'admin',
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    failedOtpAttempts: {
      type: Number,
      default: 0,
    },
    otpLockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Soft Delete Hooks
userSchema.pre(/^find/, function (next) {
  if (this.getFilter().deletedAt !== undefined) return next();
  this.find({ deletedAt: null });
  next();
});

userSchema.pre('countDocuments', function (next) {
  if (this.getFilter().deletedAt !== undefined) return next();
  this.where({ deletedAt: null });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { deletedAt: null } });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

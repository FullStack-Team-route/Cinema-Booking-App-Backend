import mongoose from "mongoose";

export interface IOtp {
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean; // True when OTP is used for password reset
  verified: boolean; // True when OTP is successfully verified
  attempts: number; // Track failed verification attempts
  lastAttemptAt: Date; // Track last verification attempt
}

const OtpSchema = new mongoose.Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    used: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3, // Maximum 3 verification attempts
    },
    lastAttemptAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for automatic expiration
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for email lookup
OtpSchema.index({ email: 1, used: 1 });

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema);

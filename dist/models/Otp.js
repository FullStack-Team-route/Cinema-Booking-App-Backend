import mongoose from "mongoose";
const OtpSchema = new mongoose.Schema({
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
    verificationToken: {
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
}, { timestamps: true });
// Index for automatic expiration
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for email lookup
OtpSchema.index({ email: 1, used: 1 });
// Index for verification token lookup
OtpSchema.index({ verificationToken: 1 }, { unique: true });
export const Otp = mongoose.model("Otp", OtpSchema);
//# sourceMappingURL=Otp.js.map
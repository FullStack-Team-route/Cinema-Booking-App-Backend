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
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    used: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Index for automatic expiration
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for email lookup
OtpSchema.index({ email: 1, used: 1 });
export const Otp = mongoose.model("Otp", OtpSchema);
//# sourceMappingURL=Otp.js.map
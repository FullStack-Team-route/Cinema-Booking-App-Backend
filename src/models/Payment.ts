import { timeStamp } from "console";
import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface PaymentType extends Document {
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripeCustomerId?: string;
  status: "pending" | "succeeded" | "failed" | "cancelled" | "refunded";
  paymentMethod?: string;
  description?: string;
  metadata?: Record<string, any>;
  refundedAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentType>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "usd",
      enum: ["usd", "eur", "gbp", "egp"],
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
    },
    description: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
    },
  },
  { timestamps: true },
);

// Indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<PaymentType>("Payment", paymentSchema);

export default Payment;

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  movieId: Types.ObjectId;
  userId: Types.ObjectId;
  customer: string;

  slotId: string; // Added for seat management
  showtime: string;
  showtimeDate: Date; // Actual date of the showtime
  auditorium: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  bookingReference: string;
  paymentId?: Types.ObjectId;

  seats: any[]; // Now array of seat objects: [{seatType, seatId, price}]
}

const bookingSchema = new Schema<IBooking>(
  {
    movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: String, required: true },

    slotId: {
      type: String,
      required: true,
    },

    showtime: {
      type: String,
      required: true,
    },

    showtimeDate: {
      type: Date,
      required: false, // Optional for backward compatibility with old bookings
    },

    auditorium: {
      type: String,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "refunded"],
      default: "pending",
    },

    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },

    seats: [{ type: Schema.Types.Mixed }], // Array of seat objects
  },
  { timestamps: true },
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;

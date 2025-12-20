import mongoose, { Schema, Document, Types } from "mongoose";
const bookingSchema = new Schema({
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
}, { timestamps: true });
export const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
//# sourceMappingURL=Booking.js.map
import mongoose from "mongoose";

// Seat Type Schema
const SeatTypeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

export interface ISlot extends mongoose.Document {
  movie: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  ampm: "AM" | "PM";
  auditorium: mongoose.Types.ObjectId;
  seatTypes: Array<{
    type: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
    label: string;
  }>;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: Array<{
    seatType: string;
    seatNumber: string;
    seatId: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new mongoose.Schema<ISlot>(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    ampm: { type: String, enum: ["AM", "PM"], default: "PM" },

    auditorium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auditorium",
      required: true,
    },

    seatTypes: [SeatTypeSchema],
    totalSeats: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },

    bookedSeats: [
      {
        seatType: String,
        seatNumber: String,
        seatId: String,
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

SlotSchema.index({ movie: 1, date: 1, time: 1 });
SlotSchema.index({ date: 1, auditorium: 1 });
SlotSchema.index({ movie: 1 });
SlotSchema.index({ isActive: 1 }); // Performance index for active slot queries

export const Slot = mongoose.model<ISlot>("Slot", SlotSchema);

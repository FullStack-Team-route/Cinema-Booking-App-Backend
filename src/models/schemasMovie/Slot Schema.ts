import mongoose, { Schema } from "mongoose";

export const SlotSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    ampm: { type: String, default: "A.M" },
  },
  { _id: false }
);

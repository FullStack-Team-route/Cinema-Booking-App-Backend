import mongoose from "mongoose";

interface IAuditorium {
  name: string;
  capacity: number;
  type: "standard" | "premium" | "imax" | "vip";
  facilities: string[]; // ["3D", "Dolby Atmos", "Recliners", etc.]
  location: string; // "Ground Floor", "First Floor", etc.
  isActive: boolean;
  movies: mongoose.Types.ObjectId[]; // أفلام تعرض في القاعة دي
  createdAt: Date;
  updatedAt: Date;
}

const AuditoriumSchema = new mongoose.Schema<IAuditorium>(
  {
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    type: {
      type: String,
      enum: ["standard", "premium", "imax", "vip"],
      default: "standard",
    },
    facilities: [{ type: String }],
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  },
  { timestamps: true }
);

// Indexes
AuditoriumSchema.index({ name: 1 });
AuditoriumSchema.index({ type: 1 });
AuditoriumSchema.index({ isActive: 1 });

export const Auditorium = mongoose.model<IAuditorium>(
  "Auditorium",
  AuditoriumSchema
);

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISlot extends Document {
  movieId: Types.ObjectId;
  showtime: string;
  auditorium: string;
  bookedSeats: string[];
}

const slotSchema = new Schema<ISlot>({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  showtime: { type: String, required: true },
  auditorium: { type: String, required: true },
  bookedSeats: { type: [String], default: [] }
}, { timestamps: true });

const Slot = mongoose.model<ISlot>('Slot', slotSchema);
export default Slot;

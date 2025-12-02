import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  movieId: Types.ObjectId;
  userId: Types.ObjectId;
  customer: string;
  movie: {
    id: Types.ObjectId;
    title: string;
    poster?: string;
    duration?: string;
    category?: string;
    year?: number;
    rating?: number;
  };
  showtime: string;
  auditorium: string;
  seats: string[]; 
}

const bookingSchema = new Schema<IBooking>({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: String, required: true },
  movie: {
    id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    poster: { type: String },
    duration: { type: String },
    category: { type: String },
    year: { type: Number },
    rating: { type: Number }
  },
  showtime: { type: String, required: true },
  auditorium: { type: String, required: true },
  seats: { type: [String], required: true }
}, { timestamps: true });



export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;

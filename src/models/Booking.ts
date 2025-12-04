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

  // ---------- Slot ----------
  slot: {
    date: string;       
    time: string;       
    auditorium: string; 
  };

  // ---------- Payment ----------
  payment: {
    ticketPrice: number;    
    totalPrice: number;     
    method: string;        
    status: string;         
    transactionId?: string; 
  };

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

  // ---------- Slot ----------
  slot: {
    date: { type: String, required: true },
    time: { type: String, required: true },
    auditorium: { type: String, required: true }
  },

  // ---------- Payment ----------
  payment: {
    ticketPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, required: true },
    transactionId: { type: String }
  },

  seats: { type: [String], required: true }

}, { timestamps: true });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;

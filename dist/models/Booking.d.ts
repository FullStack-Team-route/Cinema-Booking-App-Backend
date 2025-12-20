import mongoose, { Document, Types } from "mongoose";
export interface IBooking extends Document {
    movieId: Types.ObjectId;
    userId: Types.ObjectId;
    customer: string;
    slotId: string;
    showtime: string;
    auditorium: string;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled" | "refunded";
    bookingReference: string;
    paymentId?: Types.ObjectId;
    seats: any[];
}
export declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IBooking>;
export default Booking;
//# sourceMappingURL=Booking.d.ts.map
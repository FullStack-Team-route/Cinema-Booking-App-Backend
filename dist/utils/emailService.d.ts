interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const sendOtpEmail: (email: string, otp: string) => Promise<void>;
export declare const sendBookingConfirmation: (email: string, bookingDetails: {
    movieTitle: string;
    showtime: string;
    auditorium: string;
    seats: string[];
    totalPrice: number;
    bookingId: string;
}) => Promise<void>;
export declare const sendBookingCancellation: (email: string, bookingDetails: {
    movieTitle: string;
    bookingId: string;
    refundAmount?: number;
}) => Promise<void>;
export {};
//# sourceMappingURL=emailService.d.ts.map
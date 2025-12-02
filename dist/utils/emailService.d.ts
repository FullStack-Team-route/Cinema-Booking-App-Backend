interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const sendOtpEmail: (email: string, otp: string) => Promise<void>;
export {};
//# sourceMappingURL=emailService.d.ts.map
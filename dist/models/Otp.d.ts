import mongoose from "mongoose";
export interface IOtp {
    email: string;
    otp: string;
    verificationToken: string;
    expiresAt: Date;
    used: boolean;
    verified: boolean;
    attempts: number;
    lastAttemptAt: Date;
}
export declare const Otp: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp, {}, mongoose.DefaultSchemaOptions> & IOtp & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, IOtp>;
//# sourceMappingURL=Otp.d.ts.map
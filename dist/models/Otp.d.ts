import mongoose from "mongoose";
export interface IOtp {
    email: string;
    otp: string;
    expiresAt: Date;
    used: boolean;
}
export declare const Otp: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp, {}, mongoose.DefaultSchemaOptions> & IOtp & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, IOtp>;
//# sourceMappingURL=Otp.d.ts.map
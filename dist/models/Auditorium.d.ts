import mongoose from "mongoose";
interface IAuditorium {
    name: string;
    type: "standard" | "premium" | "imax" | "vip";
    facilities: string[];
    location: string;
    isActive: boolean;
    movies: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Auditorium: mongoose.Model<IAuditorium, {}, {}, {}, mongoose.Document<unknown, {}, IAuditorium, {}, mongoose.DefaultSchemaOptions> & IAuditorium & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, IAuditorium>;
export {};
//# sourceMappingURL=Auditorium.d.ts.map
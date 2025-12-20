import mongoose from "mongoose";
export interface UserTypes {
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    birthDate: Date;
    password: string;
    role?: "user" | "admin";
}
export interface UserDoc extends UserTypes, mongoose.Document {
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const User: mongoose.Model<UserDoc, {}, {}, {}, mongoose.Document<unknown, {}, UserDoc, {}, mongoose.DefaultSchemaOptions> & UserDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, UserDoc>;
//# sourceMappingURL=User.d.ts.map
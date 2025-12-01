import { Schema } from "mongoose";

export const PersonSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String },
    file: { type: String },
  },
  { _id: false }
);

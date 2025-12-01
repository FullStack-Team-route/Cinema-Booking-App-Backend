import mongoose, { Schema, Document } from "mongoose";
import { PersonSchema } from "./Person Schema";

export interface IMovie extends Document {
  title: string;
  description?: string;
  year?: number;
  releaseDate?: Date;
  runtime?: number;
  language?: string;
  country?: string;
  genres?: string[];
  directors?: typeof PersonSchema[];
  writers?: typeof PersonSchema[];
  cast?: typeof PersonSchema[];
  producers?: typeof PersonSchema[];
  singers?: typeof PersonSchema[];
  poster?: string;
  trailerUrl?: string;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const MovieSchema = new mongoose.Schema<IMovie>({
  title: { type: String, required: true },
  description: { type: String },

  year: Number,
  releaseDate: Date,
  runtime: Number,

  language: String,
  country: String,
  genres: [String],

  directors: [PersonSchema],
  writers: [PersonSchema],
  cast: [PersonSchema],
  producers: [PersonSchema],
  singers: [PersonSchema],

  poster: String,
  trailerUrl: String,

  slug: { type: String, index: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

MovieSchema.pre("save", function (this: IMovie, next) {
  this.updatedAt = new Date();
});

import mongoose from "mongoose";
import { LatestTrailerSchema } from "./LatestTrailerSchema";
import { SlotSchema } from "./Slot Schema";
import { PersonSchema } from "./Person Schema";

// TypeScript interface that represents a Movie document
export interface IMovie extends mongoose.Document {
  type: "normal" | "featured" | "releases-soon" | "latest-trailer";
  movieName: string;
  category?: string;
  poster?: string;
  latestTrailerURL?: string;
  videoURL?: string;
  rating?: number;
  duration?: number;
  slot?: {
    date: Date;
    time: string;
    ampm?: string;
  };
  auditorium?: string;
  people?: Array<{
    name: string;
    role?: string;
    file?: string;
  }>;
  story?: string;
  latestTrailer?: {
    title?: string;
    genre?: string;
    duration?: number;
    year?: number;
    description?: string;
    thumbnail?: string;
    videoId?: string;
    directors?: Array<{ name: string; role?: string; file?: string }>;
    producers?: Array<{ name: string; role?: string; file?: string }>;
    singers?: Array<{ name: string; role?: string; file?: string }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Main movie schema
const MovieSchema = new mongoose.Schema<IMovie>(
  {
    type: {
      type: String,
      enum: ["normal", "featured", "releases-soon", "latest-trailer"],
      default: "normal",
    },

    movieName: { type: String, required: true },
    category: String,
    poster: String,
    latestTrailerURL: String,
    videoURL: String,

    rating: Number,
    duration: Number,

    slot: SlotSchema,

    auditorium: { type: String, default: "audi one" },

    people: [PersonSchema],

    story: String,

    latestTrailer: LatestTrailerSchema,
  },
  { timestamps: true }
);

export const Movie = mongoose.model<IMovie>("Movie", MovieSchema);

import mongoose, { Schema } from "mongoose";
import { PersonSchema } from "./Person Schema";

export const LatestTrailerSchema = new mongoose.Schema(
  {
    title: String,
    genre: String,
    duration: Number,
    year: Number,
    description: String,
    thumbnail: String,
    videoId: String,

    directors: [PersonSchema],
    producers: [PersonSchema],
    singers: [PersonSchema],
  },
  { _id: false }
);

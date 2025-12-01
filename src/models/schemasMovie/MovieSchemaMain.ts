import mongoose, { Schema, model } from "mongoose";
import { LatestTrailerSchema } from "./LatestTrailerSchema";
import { SlotSchema } from "./Slot Schema";
import { PersonSchema } from "./Person Schema";

const MovieSchema = new mongoose.Schema(
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

export const Movie =mongoose.model("Movie", MovieSchema);

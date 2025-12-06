import mongoose from "mongoose";

// Interfaces for better type safety
export interface ISlot {
  save(): unknown;
  bookedSeats: any;
  date: Date;
  time: string;
  ampm: "AM" | "PM";
  price: number;
  availableSeats: number;
  totalSeats: number;
}

interface IPerson {
  name: string;
  role?: string;
  image?: string;
}

interface ITrailer {
  url?: string;
  thumbnail?: string;
  duration?: number;
  title?: string;
}

// Person Schema for cast/crew
const PersonSchema = new mongoose.Schema<IPerson>(
  {
    name: { type: String, required: true },
    role: { type: String }, // director, actor, producer, etc.
    image: String,
  },
  { _id: false }
);

// Trailer Schema
const TrailerSchema = new mongoose.Schema<ITrailer>(
  {
    url: { type: String },
    thumbnail: String,
    duration: Number, // seconds
    title: String,
  },
  { _id: false }
);

// Showtime/Slot Schema
export const SlotSchema = new mongoose.Schema<ISlot>(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true }, // "14:30"
    ampm: { type: String, enum: ["AM", "PM"], default: "PM" },
    price: { type: Number, required: true }, // ticket price
    availableSeats: { type: Number, default: 100 },
    totalSeats: { type: Number, default: 100 },
  },
  { _id: true }
);

// Movie Schema
export const MovieSchema = new mongoose.Schema(
  {
    // Basic Movie Info
    title: { type: String, required: true },
    originalTitle: String, // for foreign movies
    description: { type: String, required: true },
    shortDescription: String, // brief summary for cards

    // Media
    poster: { type: String, required: true },
    backdrop: String, // background image for banners
    trailer: TrailerSchema,
    gallery: [String], // array of image URLs

    // Movie Details
    duration: { type: Number, required: true }, // minutes
    rating: { type: Number, min: 0, max: 10 }, // IMDb-like rating
    ageRating: {
      type: String,
      enum: ["G", "PG", "PG-13", "R", "NC-17"],
      default: "PG-13",
    },

    // Release Info
    releaseDate: { type: Date, required: true },
    language: { type: String, required: true },
    country: String,
    year: { type: Number, required: true },

    // Categories & Genres
    genres: [{ type: String, required: true }], // ["Action", "Drama", etc.]
    category: {
      type: String,
      enum: ["now-showing", "coming-soon", "featured", "special-screening"],
      default: "now-showing",
    },

    // Cast & Crew
    directors: [PersonSchema],
    writers: [PersonSchema],
    cast: [PersonSchema], // main actors
    producers: [PersonSchema],
    singers: [PersonSchema], // singers/musicians

    // Cinema-specific fields
    slots: [SlotSchema], // showtimes for this movie
    auditoriums: [{ type: String }], // which auditoriums show this movie

    // Additional Info
    imdbId: String,
    rottenTomatoesScore: Number,
    budget: Number,
    boxOffice: Number,

    // Status
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for better performance
MovieSchema.index({ title: 1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ category: 1 });
MovieSchema.index({ releaseDate: 1 });
MovieSchema.index({ "slots.date": 1 });
MovieSchema.index({ rating: -1 });

// Virtual for formatted duration
MovieSchema.virtual("formattedDuration").get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Method to check if movie is currently showing
MovieSchema.methods.isCurrentlyShowing = function () {
  const now = new Date();
  return this.slots.some(
    (slot: ISlot) =>
      slot.date.toDateString() === now.toDateString() && slot.availableSeats > 0
  );
};

// Method to get available slots for a specific date
MovieSchema.methods.getAvailableSlots = function (date: Date) {
  return this.slots.filter(
    (slot: ISlot) =>
      slot.date.toDateString() === date.toDateString() &&
      slot.availableSeats > 0
  );
};

export const Movie = mongoose.model("Movie", MovieSchema);

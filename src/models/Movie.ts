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
  { _id: false },
);

// Trailer Schema
const TrailerSchema = new mongoose.Schema<ITrailer>(
  {
    url: { type: String },
    thumbnail: String,
    duration: Number, // seconds
    title: String,
  },
  { _id: false },
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
      default: "coming-soon",
    },

    // Cast & Crew
    directors: [PersonSchema],
    writers: [PersonSchema],
    cast: [PersonSchema], // main actors
    producers: [PersonSchema],
    singers: [PersonSchema], // singers/musicians

    // Cinema-specific fields
    auditoriums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auditorium" }], // which hall show this movie

    // Additional Info
    imdbId: String,
    rottenTomatoesScore: Number,
    budget: Number,
    boxOffice: Number,

    // Status
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes for better performance
MovieSchema.index({ title: 1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ category: 1 });
MovieSchema.index({ releaseDate: 1 });
MovieSchema.index({ rating: -1 });

// Virtual Population للحصول على slots مع ترتيب
MovieSchema.virtual("slots", {
  ref: "Slot",
  localField: "_id",
  foreignField: "movie",
  options: { sort: { date: 1, time: 1 } },
});

// عشان الـ virtuals تظهر في JSON/Object
MovieSchema.set("toJSON", { virtuals: true });
MovieSchema.set("toObject", { virtuals: true });

// Virtual for formatted duration
MovieSchema.virtual("formattedDuration").get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Method to check if movie is currently showing
MovieSchema.methods.isCurrentlyShowing = async function () {
  const SlotModel = mongoose.model("Slot");
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const slots = await SlotModel.find({
    movie: this._id,
    date: { $gte: startOfDay, $lt: endOfDay },
    availableSeats: { $gt: 0 },
    isActive: true,
  });

  return slots.length > 0;
};

// Method to get available slots for a specific date
MovieSchema.methods.getAvailableSlots = async function (date: Date) {
  const SlotModel = mongoose.model("Slot");
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  );

  return await SlotModel.find({
    movie: this._id,
    date: { $gte: startOfDay, $lt: endOfDay },
    availableSeats: { $gt: 0 },
    isActive: true,
  }).populate("auditorium");
};

export const Movie = mongoose.model("Movie", MovieSchema);

import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Movie } from "../models/schemasMovie/MovieSchemaMain.js";

// =============================
// Add movie
// =============================
export const addMovie = async (req: Request, res: Response) => {
  try {
    const data: any = req.body;
    const file = (req as any).file;
    if (file) data.poster = "/uploads/" + file.filename;

    const movie = await Movie.create(data);
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Get paginated movies
// =============================
export const getAllMovies = async (
  req: Request<{}, {}, {}, { page?: string }>,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find().skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({ page, totalPages, totalMovies, movies });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Update movie
// =============================
export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const data: any = req.body;
    const file = (req as any).file;

    if (file && movie.poster) {
      const oldPath = path.join(process.cwd(), movie.poster);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      data.poster = "/uploads/" + file.filename;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json(updatedMovie);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// Delete movie
// =============================
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    if (movie.poster) {
      const posterPath = path.join(process.cwd(), movie.poster);
      if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

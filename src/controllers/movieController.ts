import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Movie } from "../models/Movie.js";

// =============================
// Add movie
// =============================
export const addMovie = async (req: Request, res: Response) => {
  try {
    const data: any = req.body;
    const file = (req as any).file;
    if (file) data.poster = "/uploads/" + file.filename;

    const movie = await Movie.create(data);
    res.status(201).json({ statusMsg: "success", movie });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Get paginated movies
// =============================
export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type } = req.query as any;
    const filter: any = {};
    if (type) filter.type = type;
    const movies = await Movie.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res
      .status(200)
      .json({ statusMsg: "success", page, totalPages, total, movies });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
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
    res.status(200).json({ statusMsg: "success", updatedMovie });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
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
    res
      .status(200)
      .json({ statusMsg: "success", message: "Movie deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

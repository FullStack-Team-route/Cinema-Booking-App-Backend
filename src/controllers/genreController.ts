import type { Request, Response } from "express";
import { Genre } from "../models/Genre.js";

// =============================
// Create Genre
// =============================
export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ statusMsg: "fail", error: "Name is required" });
    }

    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res
        .status(400)
        .json({ statusMsg: "fail", error: "Genre already exists" });
    }

    const genre = await Genre.create({ name });
    res.status(201).json({ statusMsg: "success", genre });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Get All Genres
// =============================
export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.status(200).json({ statusMsg: "success", genres });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Delete Genre
// =============================
export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findByIdAndDelete(id);

    if (!genre) {
      return res
        .status(404)
        .json({ statusMsg: "fail", error: "Genre not found" });
    }

    res
      .status(200)
      .json({ statusMsg: "success", message: "Genre deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

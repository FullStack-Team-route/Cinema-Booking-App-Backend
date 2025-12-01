import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Movie } from "../models/schemasMovie/MovieSchemaMain";

const router = express.Router();

// =============================
// Multer storage
// =============================
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads")
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// =============================
// Add movie
// =============================
router.post("/addMovie", upload.single("poster"), async (req: Request, res: Response) => {
  try {
    const data: any = req.body;
    if (req.file) data.poster = "/uploads/" + req.file.filename;

    const movie = await Movie.create(data);
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// Get paginated movies
// =============================
router.get("/allMovies", async (req: Request<{}, {}, {}, { page?: string }>, res: Response) => {
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
});

// =============================
// Update movie
// =============================
router.put("/updateMovie/:id", upload.single("poster"), async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const data: any = req.body;

    if (req.file && movie.poster) {
      const oldPath = path.join(__dirname, "../../", movie.poster);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      data.poster = "/uploads/" + req.file.filename;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(updatedMovie);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// Delete movie
// =============================
router.delete("/deleteMovie/:id", async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    if (movie.poster) {
      const posterPath = path.join(__dirname, "../../", movie.poster);
      if (fs.existsSync(posterPath)) fs.unlinkSync(posterPath);
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

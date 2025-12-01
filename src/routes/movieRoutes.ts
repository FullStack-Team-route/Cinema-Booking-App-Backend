import express from "express";
import multer from "multer";
import path from "path";
import {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";

const router = express.Router();

// =============================
// Multer storage
// =============================
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// =============================
// Add movie
// =============================
router.post("/addMovie", upload.single("poster"), addMovie);

// =============================
// Get paginated movies
// =============================
router.get("/allMovies", getAllMovies);

// =============================
// Update movie
// =============================
router.put("/updateMovie/:id", upload.single("poster"), updateMovie);

// =============================
// Delete movie
// =============================
router.delete("/deleteMovie/:id", deleteMovie);

export default router;

import express from "express";
import multer from "multer";
import path from "path";
import {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

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
// Add movie (Admin only)
// =============================
router.post("/addMovie", protect, adminOnly, upload.single("poster"), addMovie);

// =============================
// Get paginated movies (Public)
// =============================
router.get("/allMovies", getAllMovies);

// =============================
// Update movie (Admin only)
// =============================
router.put(
  "/updateMovie/:id",
  protect,
  adminOnly,
  upload.single("poster"),
  updateMovie
);

// =============================
// Delete movie (Admin only)
// =============================
router.delete("/deleteMovie/:id", protect, adminOnly, deleteMovie);

export default router;

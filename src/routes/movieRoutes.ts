import express from "express";
import multer from "multer";
import {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { storage } from "../config/cloudinary.js";

const router = express.Router();

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

import express from "express";
import {
  createGenre,
  getAllGenres,
  deleteGenre,
} from "../controllers/genreController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =============================
// Get All Genres (Public)
// =============================
router.get("/", getAllGenres);

// =============================
// Create Genre (Admin only)
// =============================
router.post("/", protect, adminOnly, createGenre);

// =============================
// Delete Genre (Admin only)
// =============================
router.delete("/:id", protect, adminOnly, deleteGenre);

export default router;

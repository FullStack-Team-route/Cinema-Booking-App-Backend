import express from "express";
import multer from "multer";
import {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  searchMovies,
  getMoviesByGenre,
  getMoviesByYear,
  getTopRatedMovies,
  getMoviesByPerson,
  getFeaturedMovies,
  searchAutoComplete,
  getLatestTrailers,
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

// =============================
// 🔍 Advanced Search & Discovery APIs
// =============================

// البحث المتقدم الشامل
router.get("/search", searchMovies);

// الاقتراحات التلقائية
router.get("/autocomplete", searchAutoComplete);

// البحث بالتصنيف
router.get("/genre/:genre", getMoviesByGenre);

// البحث بالسنة
router.get("/year/:year", getMoviesByYear);

// البحث بالشخص (ممثل/مخرج/كاتب)
router.get("/person/:name/:role", getMoviesByPerson);
router.get("/person/:name", getMoviesByPerson);

// أفضل الأفلام تقييماً
router.get("/top-rated", getTopRatedMovies);

// الأفلام المميزة
router.get("/featured", getFeaturedMovies);

// أحدث الـ Trailers
router.get("/latest-trailers", getLatestTrailers);

// Legacy route for backward compatibility
router.get("/allMovies", getAllMovies);

export default router;

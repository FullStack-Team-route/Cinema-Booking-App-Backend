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
  getSpecificMovie,
  getMoviesByDate,
  getSeatLayout,
} from "../controllers/movieController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { storage } from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({ storage });

// Configure multer for movie uploads with multiple files
const movieUpload = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "gallery", maxCount: 10 }, // Up to 10 gallery images
  { name: "directorsImages", maxCount: 10 }, // Images for directors
  { name: "castImages", maxCount: 20 }, // Images for cast members
  { name: "writersImages", maxCount: 10 }, // Images for writers
  { name: "producersImages", maxCount: 10 }, // Images for producers
  { name: "singersImages", maxCount: 10 }, // Images for singers
]);

// =============================
// Add movie (Admin only)
// =============================
router.post("/addMovie", protect, adminOnly, movieUpload, addMovie);

// =============================
// Get paginated movies (Public)
// =============================
router.get("/allMovies", getAllMovies);

// =============================
// Get specific movie (Public)
// =============================
router.get("/getSpecificMovie/:id", getSpecificMovie);

// =============================
// Update movie (Admin only)
// =============================
router.put("/updateMovie/:id", protect, adminOnly, movieUpload, updateMovie);

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

// جدولة الأفلام حسب التاريخ
router.get("/by-date", getMoviesByDate);

// تخطيط المقاعد للحجز
router.get("/seat-layout/:movieId/:slotId", getSeatLayout);

// Legacy route for backward compatibility
router.get("/allMovies", getAllMovies);

export default router;

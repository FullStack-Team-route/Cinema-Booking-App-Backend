import express from "express";
import multer from "multer";
import {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  searchMovies,
  getAllGenres,
  getMoviesByGenre,
  getMoviesByYear,
  getTopRatedMovies,
  getMoviesByPerson,
  getFeaturedMovies,
  getComingSoonMovies,
  getNowShowingMovies,
  searchAutoComplete,
  getLatestTrailers,
  getSpecificMovie,
  getMoviesByDate,
  getSeatLayout,
  toggleFeaturedStatus,
  getSliderMovies,
} from "../controllers/movieController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { storage } from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({ storage });

// Configure multer for movie uploads with multiple files
// نستخدم any() بدلاً من fields() لأن FormData يرسل الملفات بأسماء مختلفة
const movieUpload = upload.any();

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
// Toggle Featured Status (Admin only)
// =============================
router.patch("/toggleFeatured/:id", protect, adminOnly, toggleFeaturedStatus);

// =============================
// Delete movie (Admin only)
// =============================
router.delete("/deleteMovie/:id", protect, adminOnly, deleteMovie);

// =============================
// 🔍 Advanced Search & Discovery APIs
// =============================

// البحث المتقدم الشامل
router.get("/search", searchMovies);

// الحصول على كل التصنيفات
router.get("/genres", getAllGenres);

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

// الأفلام القادمة (بدون مواعيد عرض في الـ 7 أيام القادمة)
router.get("/coming-soon", getComingSoonMovies);

// الأفلام المعروضة حالياً (لها مواعيد عرض في الـ 7 أيام القادمة)
router.get("/now-showing", getNowShowingMovies);

// أحدث الـ Trailers
router.get("/latest-trailers", getLatestTrailers);

// جدولة الأفلام حسب التاريخ
router.get("/by-date", getMoviesByDate);

// تخطيط المقاعد للحجز
router.get("/seat-layout/:movieId/:slotId", getSeatLayout);

// الأفلام للـ Home Main Slider (ليها مواعيد ومش featured)
router.get("/slider", getSliderMovies);

export default router;

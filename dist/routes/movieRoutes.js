import express from "express";
import multer from "multer";
import { addMovie, getAllMovies, updateMovie, deleteMovie, searchMovies, getMoviesByGenre, getMoviesByYear, getTopRatedMovies, getMoviesByPerson, getFeaturedMovies, searchAutoComplete, getLatestTrailers, getSpecificMovie, getMoviesByDate, getSeatLayout, addSlotToMovie, updateSlot, deleteSlot, getMovieSlots, getAllSlots, getSlotsStatistics, } from "../controllers/movieController.js";
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
// Get specific movie (Public)
// =============================
router.get("/getSpecificMovie/:id", getSpecificMovie);
// =============================
// Update movie (Admin only)
// =============================
router.put("/updateMovie/:id", protect, adminOnly, upload.single("poster"), updateMovie);
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
// =============================
// Slot Management Routes (Admin only)
// =============================
// إضافة slot جديد لفيلم
router.post("/movies/:movieId/slots", protect, adminOnly, addSlotToMovie);
// تعديل slot موجود
router.put("/movies/:movieId/slots/:slotId", protect, adminOnly, updateSlot);
// حذف slot
router.delete("/movies/:movieId/slots/:slotId", protect, adminOnly, deleteSlot);
// جلب جميع slots لفيلم معين
router.get("/movies/:movieId/slots", protect, adminOnly, getMovieSlots);
// جلب جميع slots لجميع الأفلام (Admin only)
router.get("/slots", protect, adminOnly, getAllSlots);
// إحصائيات الـ slots (Admin only)
router.get("/slots/statistics", protect, adminOnly, getSlotsStatistics);
export default router;
//# sourceMappingURL=movieRoutes.js.map
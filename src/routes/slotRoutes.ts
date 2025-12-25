import express from "express";
import {
  addSlotToMovie,
  updateSlot,
  deleteSlot,
  getMovieSlots,
  getAllSlots,
  getSlotsStatistics,
} from "../controllers/slotController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

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

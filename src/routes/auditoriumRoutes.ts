import express from "express";
import {
  addAuditorium,
  getAllAuditoriums,
  getAuditorium,
  updateAuditorium,
  deleteAuditorium,
  manageAuditoriumMovies,
} from "../controllers/auditoriumController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// إضافة قاعة جديدة
router.post("/add", protect, adminOnly, addAuditorium);

// جلب جميع القاعات
router.get("/all", protect, adminOnly, getAllAuditoriums);

// جلب قاعة محددة
router.get("/:id", protect, adminOnly, getAuditorium);

// تحديث قاعة
router.put("/:id", protect, adminOnly, updateAuditorium);

// حذف قاعة
router.delete("/:id", protect, adminOnly, deleteAuditorium);

// إضافة/إزالة فيلم من قاعة
router.post("/:id/movies/:movieId", protect, adminOnly, manageAuditoriumMovies);

export default router;

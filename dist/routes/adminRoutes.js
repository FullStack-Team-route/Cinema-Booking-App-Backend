import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
const router = express.Router();
// =========================
//  Dashboard Statistics (Admin Only)
// =========================
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);
export default router;
//# sourceMappingURL=adminRoutes.js.map
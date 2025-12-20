import express from "express";
import { loginUser, registerUser, logoutUser, getCurrentUser, updateUser, updatePassword, getUsers, forgotPassword, verifyOtp, resetPassword, } from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validateRegister, validateLogin, validateResetPassword, } from "../middlewares/validationMiddleware.js";
const router = express.Router();
// Public routes (no authentication required)
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
// Protected routes (authentication required)
router.post("/logout", protect, logoutUser);
router.get("/current-user", protect, getCurrentUser);
router.put("/update", protect, updateUser);
router.put("/update-password", protect, updatePassword);
// Admin only routes (authentication + admin role required)
router.get("/users", protect, adminOnly, getUsers);
// Password reset routes (no authentication required)
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", validateResetPassword, resetPassword);
export default router;
//# sourceMappingURL=userRoutes.js.map
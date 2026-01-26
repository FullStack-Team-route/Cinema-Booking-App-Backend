import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  updatePassword,
  getUsers,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
  updateUserStatus,
  searchUsers,
  getUsersStats,
  forgotPassword,
  verifyOtp,
  resetPassword,
  uploadUserProfileImage,
} from "../controllers/userController.js";
import { uploadProfileImage } from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateUpdateUserRole,
  validateUpdateUserStatus,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", validateRegister, registerUser);

router.post("/login", validateLogin, loginUser);

// Protected routes (authentication required)
router.post("/logout", protect, logoutUser);

router.get("/current-user", protect, getCurrentUser);

router.put("/update", protect, updateUser);

router.put("/update-password", protect, updatePassword);

router.post(
  "/profile/upload-image",
  protect,
  uploadProfileImage.single("profileImage"),
  uploadUserProfileImage,
);

// Admin only routes (authentication + admin role required)
router.get("/users", protect, adminOnly, getUsers);

router.delete("/users/:id", protect, adminOnly, deleteUser);

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  validateUpdateUserRole,
  updateUserRole,
);

router.put("/users/:id/status", protect, adminOnly, toggleUserStatus);

router.put(
  "/users/:id/set-status",
  protect,
  adminOnly,
  validateUpdateUserStatus,
  updateUserStatus,
);

router.get("/users/search", protect, adminOnly, searchUsers);

router.get("/users/stats", protect, adminOnly, getUsersStats);

// Password reset routes (no authentication required)
router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOtp);

router.post("/reset-password", validateResetPassword, resetPassword);

export default router;

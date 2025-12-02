import express from "express";
import { loginUser, registerUser, logoutUser, getCurrentUser, updateUser, updatePassword, getUsers, forgotPassword, verifyOtp, resetPassword, } from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
const router = express.Router();
// Public routes (no authentication required)
router.post("/register", [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    body("email")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("birthDate")
        .isISO8601()
        .toDate()
        .withMessage("Valid birth date is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], registerUser);
router.post("/login", [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
], loginUser);
// Protected routes (authentication required)
router.post("/logout", protect, logoutUser);
router.get("/current-user", protect, getCurrentUser);
router.put("/update", protect, [
    body("fullName")
        .optional()
        .notEmpty()
        .withMessage("Full name cannot be empty"),
    body("username")
        .optional()
        .notEmpty()
        .withMessage("Username cannot be empty")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("phoneNumber")
        .optional()
        .notEmpty()
        .withMessage("Phone number cannot be empty"),
    body("birthDate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Valid birth date is required"),
], updateUser);
router.put("/update-password", protect, [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
], updatePassword);
// Admin only routes (authentication + admin role required)
router.get("/users", protect, adminOnly, getUsers);
// Password reset routes (no authentication required)
router.post("/forgot-password", [
    body("email")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
], forgotPassword);
router.post("/verify-otp", [
    body("email")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),
], verifyOtp);
router.post("/reset-password", [
    body("email")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),
], resetPassword);
export default router;
//# sourceMappingURL=userRoutes.js.map
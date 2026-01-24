import express from "express";
import {
  createCheckoutSession,
  createPaymentIntent,
  getAllPayments,
  getPaymentDetails,
  getStripeConfig,
  getUserPayments,
  processRefund,
} from "../controllers/paymentController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/config", getStripeConfig);

// Protected Routes
router.use(protect);

router.post("/create-intent", createPaymentIntent);
router.post("/create-checkout-session", createCheckoutSession);
router.get("/my-payments", getUserPayments);
router.get("/:paymentId", getPaymentDetails);
router.post("/refund", processRefund);

// Admin only routes
router.get("/admin/all", adminOnly, getAllPayments);

export default router;

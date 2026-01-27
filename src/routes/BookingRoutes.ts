import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  saveTicketPrice,
  confirmBooking,
  cancelBooking,
  getBookingById,
} from "../controllers/BookingController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =========================
//  Create Booking
// =========================
router.post("/addBooking", protect, createBooking);

// =========================
//  Get All Bookings (Admin)
// =========================
router.get("/allBookings", protect, adminOnly, getAllBookings);

// =========================
//  Get User Bookings
// =========================
router.get("/userBookings/:userId", protect, getUserBookings);

// =========================
//  Update Booking (Pending Only)
// =========================
router.put("/updateBookings/:bookingId", protect, updateBooking);

// =========================
//  Save Ticket Price
// =========================
router.put("/priceBookings/:bookingId", protect, saveTicketPrice);

// =========================
//  Confirm Booking
// =========================
router.put("/confirmBookings/:bookingId", protect, confirmBooking);

// =========================
//  Cancel Booking
// =========================
router.put("/cancelBookings/:bookingId", protect, cancelBooking);

// =========================
//  Get Booking Details (Admin Only)
// =========================
router.get("/:bookingId", protect, adminOnly, getBookingById);

export default router;

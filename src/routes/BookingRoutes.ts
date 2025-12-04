import express from 'express';
import { createBooking, getAllBookings } from '../controllers/BookingController.js';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/AddBooking', protect, createBooking);

router.get('/AddMovie', protect, adminOnly, getAllBookings);

export default router;

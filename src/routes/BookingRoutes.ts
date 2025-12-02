import express from 'express';
import { createBooking, getAllBookings } from '../controllers/BookingController.js';

const router = express.Router();

router.post('/addBooking', createBooking);
router.get('/allBooking', getAllBookings);

export default router;

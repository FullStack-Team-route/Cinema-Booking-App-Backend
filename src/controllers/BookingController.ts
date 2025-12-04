import { Movie, type ISlot } from '../models/Movie.js';
import Booking from '../models/Booking.js';
import type { Request, Response } from 'express';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      movieId, 
      userId, 
      customer, 
      movieData, 
      slot,       
      payment,    
      seats 
    } = req.body;

    // ---------- Validation ----------
    if (!movieId || !userId || !customer || !movieData || !slot || !payment || !seats) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { date, time, auditorium } = slot;

    if (!date || !time || !auditorium)
      return res.status(400).json({ message: 'Slot data is incomplete' });

    if (!payment.ticketPrice || !payment.totalPrice || !payment.method || !payment.status)
      return res.status(400).json({ message: 'Payment data is incomplete' });

    // ---------- Check movie existence ----------
    const movieExists = await Movie.findById(movieId);
    if (!movieExists) return res.status(404).json({ message: 'Movie not found' });

    // ---------- Find Slot ----------
    const foundSlot: ISlot | null = await slot.findOne({
      movieId,
      date,
      time,
      auditorium
    });

    if (!foundSlot)
      return res.status(404).json({ message: 'Showtime slot not found' });

    // ---------- Check seat availability ----------
    const unavailableSeats = seats.filter((seat: string) =>
      foundSlot.bookedSeats.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${unavailableSeats.join(', ')}`
      });
    }

    // ---------- Create Booking ----------
    const newBooking = new Booking({
      movieId,
      userId,
      customer,
      movie: movieData,
      slot: {
        date,
        time,
        auditorium
      },
      payment,
      seats
    });

    await newBooking.save();

    // ---------- Update Slot ----------
    foundSlot.bookedSeats.push(...seats);
    await foundSlot.save();

    return res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

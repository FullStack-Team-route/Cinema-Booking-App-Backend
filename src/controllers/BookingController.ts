import { Movie } from '../models/Movie.js';
import Slot, { type ISlot } from '../models/Slot.js';
import Booking from '../models/Booking.js';
import type { Request, Response } from 'express';


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { movieId, userId, customer, movieData, showtime, auditorium, seats } = req.body as {
      movieId: string;
      userId: string;
      customer: string;
      movieData: any;
      showtime: string;
      auditorium: string;
      seats: string[];
    };

    if (!movieId || !userId || !customer || !movieData || !showtime || !auditorium || !seats) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const movieExists = await Movie.findById(movieId);
    if (!movieExists) return res.status(404).json({ message: 'Movie not found' });

    const slot: ISlot | null = await Slot.findOne({ movieId, showtime, auditorium });
    if (!slot) return res.status(404).json({ message: 'Showtime slot not found' });

    const unavailableSeats = seats.filter((seat: string) => slot.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: `Seats already booked: ${unavailableSeats.join(', ')}` });
    }

    const newBooking = new Booking({
      movieId,
      userId,
      customer,
      movie: movieData,
      showtime,
      auditorium,
      seats
    });
    await newBooking.save();

    slot.bookedSeats.push(...seats);
    await slot.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

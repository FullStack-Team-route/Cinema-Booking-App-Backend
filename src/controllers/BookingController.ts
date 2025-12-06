import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import { Movie } from "../models/Movie.js";


// ===============================
//  Create Booking
// ===============================
export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      movieId,
      userId,
      customer,
      movieData,
      slotId,
      seats,
      totalPrice,
      paymentId
    } = req.body;

    if (!movieId || !userId || !customer || !movieData || !slotId || !seats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ---------- Get Movie ----------
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // ---------- Find Slot inside movie.slots ----------
    const foundSlot: any = movie.slots.id(slotId);

    if (!foundSlot)
      return res.status(404).json({ message: "Showtime slot not found" });

    // ---------- Check seat availability ----------
    const unavailableSeats = seats.filter((seat: string) =>
      foundSlot.bookedSeats?.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${unavailableSeats.join(", ")}`,
      });
    }

    // Initialize bookedSeats if undefined
    if (!foundSlot.bookedSeats) foundSlot.bookedSeats = [];

    // Add seats to slot
    foundSlot.bookedSeats.push(...seats);

    // Reduce available seats
    foundSlot.availableSeats -= seats.length;

    await movie.save();

    // ---------- Generate Booking Reference ----------
    const bookingReference =
      "BK-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // ---------- Create Booking ----------
    const newBooking = await Booking.create({
      movieId,
      userId,
      customer,
      movie: movieData,
      showtime: `${foundSlot.time} ${foundSlot.ampm}`,
      auditorium: movie.auditoriums?.[0] || "Auditorium 1",
      totalPrice,
      status: "pending",
      bookingReference,
      paymentId: paymentId || null,
      seats,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ===============================
//  Get All Bookings
// ===============================
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ===============================
//  Get Bookings by User
// ===============================
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ===============================
//  Update Booking
// ===============================
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "confirmed" || booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot update a confirmed or cancelled booking",
      });
    }

    Object.assign(booking, updates);
    await booking.save();

    return res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ===============================
//  Save (Update) Ticket Price
// ===============================
export const saveTicketPrice = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { totalPrice } = req.body;

    if (!totalPrice)
      return res.status(400).json({ message: "totalPrice is required" });

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.totalPrice = totalPrice;
    await booking.save();

    return res.status(200).json({
      message: "Ticket price updated successfully",
      booking,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ===============================
//  Confirm Booking
// ===============================
export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = "confirmed";
    await booking.save();

    return res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ===============================
//  Cancel Booking
// ===============================
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

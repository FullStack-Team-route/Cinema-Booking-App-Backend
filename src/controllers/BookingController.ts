import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import { Movie } from "../models/Movie.js";
import { Slot } from "../models/Slot.js";
import { User } from "../models/User.js";

// ===============================
//  Create Booking
// ===============================
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { movieId, userId, customer, slotId, seats, totalPrice, paymentId } =
      req.body;

    if (!movieId || !userId || !customer || !slotId || !seats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ---------- Validate User ID ----------
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ---------- Validate Movie ID ----------
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // ---------- Find Slot ----------
    const foundSlot = await Slot.findById(slotId);

    if (!foundSlot)
      return res.status(404).json({ message: "Showtime slot not found" });

    // ---------- Check if slot belongs to movie ----------
    if (foundSlot.movie.toString() !== movieId)
      return res
        .status(400)
        .json({ message: "Slot does not belong to this movie" });

    // ---------- Check seat availability for each seat type ----------
    const unavailableSeats: string[] = [];
    const seatsToBook: any[] = [];

    for (const seat of seats) {
      // Check if seat is already booked
      const isBooked = foundSlot.bookedSeats?.some(
        (booked: any) => booked.seatId === seat.seatId,
      );

      if (isBooked) {
        unavailableSeats.push(seat.seatId);
      } else {
        // Find the seat type to reduce available seats
        const seatType = (foundSlot as any).seatTypes.find(
          (type: any) => type.type === seat.seatType,
        );
        if (seatType && seatType.availableSeats > 0) {
          seatsToBook.push(seat);
          seatType.availableSeats -= 1;
        } else {
          unavailableSeats.push(seat.seatId);
        }
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats not available: ${unavailableSeats.join(", ")}`,
      });
    }

    // Initialize bookedSeats if undefined
    if (!foundSlot.bookedSeats) foundSlot.bookedSeats = [];

    // Add seats to slot with new format
    const bookedSeatsData = seatsToBook.map((seat) => ({
      seatType: seat.seatType,
      seatNumber: seat.seatId,
      seatId: seat.seatId,
    }));

    foundSlot.bookedSeats.push(...bookedSeatsData);

    // Update total available seats
    foundSlot.availableSeats = (foundSlot as any).seatTypes.reduce(
      (total: number, type: any) => total + type.availableSeats,
      0,
    );

    await foundSlot.save();

    // ---------- Generate Booking Reference ----------
    const bookingReference =
      "BK-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // ---------- Create Booking ----------
    // Get auditorium name from slot
    const populatedSlot = await Slot.findById(slotId).populate(
      "auditorium",
      "name",
    );
    const auditoriumName =
      (populatedSlot as any)?.auditorium?.name || "Auditorium 1";

    const bookingData = {
      movieId,
      userId,
      customer,
      slotId,
      showtime: `${foundSlot.time} ${foundSlot.ampm}`,
      showtimeDate: foundSlot.date, // Save the actual showtime date
      auditorium: auditoriumName,
      totalPrice,
      status: "pending" as const,
      bookingReference,
      paymentId: paymentId || null,
      seats,
    };
    const newBooking = await Booking.create(bookingData as any);

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
//  Get All Bookings (Admin - with pagination & filtering)
// ===============================
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      movieId,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
      customer,
      minPrice,
      maxPrice,
    } = req.query as any;

    const filter: any = {};
    // Filter by status
    if (status && status !== "all") {
      filter.status = status;
    }

    // Filter by movie
    if (movieId) {
      filter.movieId = movieId;
    }

    // Filter by customer name (case insensitive)
    if (customer) {
      filter.customer = { $regex: customer, $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.totalPrice = {};
      if (minPrice) {
        filter.totalPrice.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.totalPrice.$lte = Number(maxPrice);
      }
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    // Get paginated results
    const bookings = await Booking.find(filter)
      .populate("movieId", "title poster")
      .populate("userId", "fullName email")
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    return res.status(200).json({
      statusMsg: "success",
      data: {
        bookings,

        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,

        filters: {
          applied: Object.keys(filter).length > 0,
          status,
          movieId,
          startDate,
          endDate,
          customer,
          minPrice,
          maxPrice,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===============================
//  Get Booking By ID (Admin Only)
// ===============================
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate(
        "movieId",
        "title poster genres duration rating releaseDate description",
      )
      .populate("userId", "fullName email phone")
      .populate("paymentId")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      statusMsg: "success",
      data: booking,
    });
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
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query as any;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const filter: any = { userId };

    // Filter by status if provided
    if (status && status !== "all") {
      filter.status = status;
    }

    // Build sort object
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    // Get paginated results
    const bookings = await Booking.find(filter)
      .populate(
        "movieId",
        "title poster genres duration rating releaseDate description",
      )
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    // Get all unique slotIds from bookings
    const slotIds = [
      ...new Set(bookings.map((b: any) => b.slotId).filter(Boolean)),
    ];

    // Fetch all slots at once for efficiency (for old bookings that don't have showtimeDate)
    const slots = await Slot.find({ _id: { $in: slotIds } })
      .populate("auditorium", "name")
      .lean();

    // Create a map for quick slot lookup
    const slotMap = new Map(
      slots.map((slot: any) => [slot._id.toString(), slot]),
    );

    // Format bookings to include showtime date
    const formattedBookings = bookings.map((booking: any) => {
      const slot = slotMap.get(booking.slotId);

      // Use booking.showtimeDate if available (new bookings), otherwise try to get from slot (old bookings)
      const showtimeDate = booking.showtimeDate || slot?.date || null;

      // Format the showtime with date
      let showtimeFormatted = booking.showtime;
      if (showtimeDate) {
        const dateStr = new Date(showtimeDate).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const timeStr = slot ? `${slot.time} ${slot.ampm}` : booking.showtime;
        showtimeFormatted = `${dateStr} at ${timeStr}`;
      }

      return {
        ...booking,
        showtimeDate,
        showtimeFormatted,
        auditoriumName: (slot?.auditorium as any)?.name || booking.auditorium,
        slotDetails: slot
          ? {
              date: slot.date,
              time: slot.time,
              ampm: slot.ampm,
              auditorium: (slot.auditorium as any)?.name,
            }
          : null,
      };
    });

    return res.status(200).json({
      statusMsg: "success",
      data: {
        bookings: formattedBookings,

        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,

        filters: {
          applied: Object.keys(filter).length > 1, // userId is always applied
          status,
          sortBy,
          sortOrder,
        },
      },
    });
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

    if (!booking) return res.status(404).json({ message: "Booking not found" });

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

    if (!booking) return res.status(404).json({ message: "Booking not found" });

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

    if (!booking) return res.status(404).json({ message: "Booking not found" });

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
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Return seats to available if booking was confirmed
    if (booking.status === "confirmed") {
      const slot = await Slot.findById(booking.slotId);
      if (slot) {
        // Remove booked seats from slot
        slot.bookedSeats = slot.bookedSeats.filter(
          (booked: any) =>
            !booking.seats.some((seat: any) => seat.seatId === booked.seatId),
        );

        // Return seats to available by type
        booking.seats.forEach((seat: any) => {
          const seatType = (slot as any).seatTypes.find(
            (type: any) => type.type === seat.seatType,
          );
          if (seatType) {
            seatType.availableSeats += 1;
          }
        });

        // Update total available seats
        slot.availableSeats = (slot as any).seatTypes.reduce(
          (total: number, type: any) => total + type.availableSeats,
          0,
        );

        await slot.save();
      }
    }

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

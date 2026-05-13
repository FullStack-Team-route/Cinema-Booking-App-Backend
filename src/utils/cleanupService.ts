import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import { Slot } from "../models/Slot.js";

/**
 * Cleanup expired pending bookings
 * Pending bookings older than 10 minutes will be cancelled and seats released.
 */
export const startCleanupJob = () => {
  // Config: Run every 1 minute
  const INTERVAL_MS = 60 * 1000;
  // Config: Expire after 10 minutes
  const EXPIRATION_MS = 10 * 60 * 1000;

  console.log(
    "[Cleanup] 🕒 Starting Booking Cleanup Service (Interval: 1m, Expiration: 10m)",
  );

  const cleanupTask = async () => {
    if (mongoose.connection.readyState !== 1) {
      console.warn("[Cleanup] ⚠️ DB not connected, skipping cleanup.");
      return;
    }

    try {
      // Find bookings pending for more than 10 minutes
      const expirationTime = new Date(Date.now() - EXPIRATION_MS);

      const expiredBookings = await Booking.find({
        status: "pending",
        createdAt: { $lt: expirationTime },
      });

      if (expiredBookings.length === 0) return;

      console.log(
        `[Cleanup] Found ${expiredBookings.length} expired bookings.`,
      );

      for (const booking of expiredBookings) {
        console.log(
          `[Cleanup] Processing booking ${booking.bookingReference}...`,
        );

        // Find slot
        const slot = await Slot.findById(booking.slotId);

        if (slot) {
          // Release seats from slot
          // We filter OUT the seats that match the booking seats
          const initialBookedCount = slot.bookedSeats.length;

          slot.bookedSeats = slot.bookedSeats.filter(
            (booked: any) =>
              !booking.seats.some((seat: any) => seat.seatId === booked.seatId),
          );

          const releasedCount = initialBookedCount - slot.bookedSeats.length;

          if (releasedCount > 0) {
            // Return seats to available by type in the seatTypes array
            booking.seats.forEach((seat: any) => {
              const seatType = (slot as any).seatTypes.find(
                (type: any) => type.type === seat.seatType,
              );
              if (seatType) {
                seatType.availableSeats += 1;
              }
            });

            // Recalculate total available seats
            slot.availableSeats = (slot as any).seatTypes.reduce(
              (total: number, type: any) => total + type.availableSeats,
              0,
            );

            await slot.save();
            console.log(
              `[Cleanup] 🔓 Released ${releasedCount} seats for slot ${slot._id}`,
            );
          }
        } else {
          console.warn(
            `[Cleanup] ⚠️ Slot not found for booking ${booking.bookingReference}`,
          );
        }

        // Mark booking as cancelled
        booking.status = "cancelled";
        await booking.save();
        console.log(
          `[Cleanup] ❌ Cancelled expired booking: ${booking.bookingReference}`,
        );
      }
    } catch (error) {
      console.error("[Cleanup] ❌ Error during cleanup:", error);
    }
  };

  // Run immediately on start
  cleanupTask();

  // Schedule periodic run
  setInterval(cleanupTask, INTERVAL_MS);
};

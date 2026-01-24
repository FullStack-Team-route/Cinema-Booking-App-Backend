import type { Request, Response } from "express";
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import StripeService from "../utils/stripeService.js";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

/**
 * Create Payment intent for Booking
 */

export const createPaymentIntent = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { bookingId, amount, currency } = req.body;
    const userId = req.user?.id;

    if (!bookingId || !amount) {
      return res.status(400).json({
        message: "Booking ID and amount are required",
      });
    }

    // verify if booking exist or not
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: userId as any,
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // check if booking already has a payment
    const existingPayment = await Payment.findOne({ bookingId });
    if (existingPayment && existingPayment.status === "succeeded") {
      return res.status(400).json({ message: "Booking already paid" });
    }

    const result = await StripeService.createPaymentIntent({
      amount: Math.round(amount * 100),
      currency: currency || "usd",
      bookingId,
      userId: userId as any,
      description: `Payment for booking ${booking.bookingReference}`,
    });

    res.status(201).json({
      message: "Payment intent created successfully",
      data: {
        paymentIntentId: result.paymentIntent.id,
        clientSecret: result.clientSecret,
        paymentId: result.paymentId,
        amount: result.paymentIntent.amount,
        currency: result.paymentIntent.currency,
      },
    });
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

/**
 * Get payment details
 */

export const getPaymentDetails = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id;

    const payment = await Payment.findOne({
      _id: paymentId as any,
      userId: userId as any,
    }).populate("bookingId", "movie showtime seats bookingReference");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      message: "Payment details retrieved successfully",
      payment,
    });
  } catch (error: any) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      message: "Failed to retrieve payment details",
      error: error.message,
    });
  }
};

/**
 * Process refund
 */

export const processRefund = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    // find payment
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // check permission (user can refund their own payments, admin can refund any)
    if (!isAdmin && payment.userId.toString() !== (userId as any)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to refund this payment" });
    }

    const result = await StripeService.processRefund({
      paymentIntentId,
      amount: amount ? Math.round(amount * 100) : 0,
      reason,
    });

    res.json({
      message: "Refund processed successfully",
      refund: result.refund,
      payment: result.payment,
    });
  } catch (error: any) {
    console.error("Process refund error:", error);
    res.status(500).json({
      message: "Failed to process refund",
      error: error.message,
    });
  }
};

/**
 * Get user payments
 */

export const getUserPayments = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    const filter: any = { userId };

    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate(
        "bookingId",
        "movie showtime seats totalPrice bookingReference status",
      )
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      message: "User payments retrieved successfully",
      data: {
        payments,
        pagination: {
          page: +page,
          limit: +limit,
          total,
          pages: Math.ceil(total / +limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Get user payments error:", error);
    res.status(500).json({
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

/**
 * Get all payments (admin only)
 */
export const getAllPayments = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      startDate,
      endDate,
    } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const payments = await Payment.find(filter)
      .populate("bookingId", "movie showtime seats bookingReference")
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Payment.countDocuments(filter);
    const totalAmount = await Payment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      message: "All payments retrieved successfully",
      data: {
        payments,
        summary: {
          totalPayments: total,
          totalAmount: totalAmount[0]?.total || 0,
          currency: "usd",
        },
        pagination: {
          page: +page,
          limit: +limit,
          total,
          pages: Math.ceil(total / +limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Get all payments error:", error);
    res.status(500).json({
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

/**
 * Get Stripe publishable key
 */
export const getStripeConfig = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const publishableKey = StripeService.getPublishableKey();

    if (!publishableKey) {
      return res
        .status(500)
        .json({ message: "Stripe configuration not found" });
    }

    res.json({
      message: "Stripe config retrieved successfully",
      data: {
        publishableKey,
      },
    });
  } catch (error: any) {
    console.error("Get Stripe config error:", error);
    res.status(500).json({
      message: "Failed to retrieve Stripe configuration",
      error: error.message,
    });
  }
};

/**
 * Create Stripe Checkout Session
 */
export const createCheckoutSession = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user?.id;

    console.log(
      `[CreateCheckout] Request - BookingID: ${bookingId}, UserID: ${userId}`,
    );

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // 1. Find booking by ID only first to check existence
    const booking = await Booking.findById(bookingId).populate(
      "movieId",
      "title",
    );

    if (!booking) {
      console.log(
        `[CreateCheckout] Booking not found in DB with ID: ${bookingId}`,
      );
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`[CreateCheckout] Booking found. Owner: ${booking.userId}`);

    // 2. Check ownership
    // Ensure both are strings for comparison
    const bookingOwnerId = booking.userId.toString();
    const requestUserId = userId?.toString();

    if (bookingOwnerId !== requestUserId) {
      console.log(
        `[CreateCheckout] Authorization failed. Token User: ${requestUserId}, Booking Owner: ${bookingOwnerId}`,
      );
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this booking" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ message: "Booking already confirmed" });
    }

    const result = await StripeService.createCheckoutSession({
      bookingId,
      userId: userId!,
      amount: booking.totalPrice,
      movieTitle: (booking.movieId as any).title || "Movie Ticket",
      seats: booking.seats.map((s: any) => s.seatId || s.seatNumber),
      successUrl: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel?bookingId=${bookingId}`,
    });

    res.status(201).json({
      message: "Checkout session created successfully",
      success: true,
      data: {
        sessionId: result.sessionId,
        sessionUrl: result.sessionUrl,
      },
    });
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    res.status(500).json({
      message: "Failed to create checkout session",
      success: false,
      error: error.message,
    });
  }
};

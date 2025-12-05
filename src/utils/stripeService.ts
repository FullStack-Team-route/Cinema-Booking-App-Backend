import Stripe from "stripe";
import Payment from "../models/Payment.js";
import { Movie } from "../models/Movie.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  bookingId: string;
  userId: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface RefundData {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export class StripeService {
  /**
   * Create a payment intent for booking
   */

  static async createPaymentIntent(data: CreatePaymentIntentData) {
    try {
      const {
        amount,
        bookingId,
        currency = "usd",
        userId,
        description,
        metadata = {},
      } = data;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        description: description || `Cinema booking - ${bookingId}`,
        metadata: {
          bookingId,
          userId,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
        setup_future_usage: "off_session",
      });

      // Save Payment record in database
      const payment = new Payment({
        bookingId,
        userId,
        amount,
        currency,
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
        description,
        metadata,
      });

      await payment.save();

      return {
        paymentIntent,
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  /**
   * Confirm payment intent
   */

  static async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error) {
      console.error("Error confirming payment intent:", error);
      throw new Error("Failed to confirm payment");
    }
  }

  /**
   * Cancel Payment intent
   */

  static async cancelPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

      // update payment status in db
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        { status: "cancelled" }
      );

      return paymentIntent;
    } catch (error) {
      console.error("Error cancelling payment intent:", error);
      throw new Error("Failed to cancel payment");
    }
  }

  /**
   * Get payment intent status
   */
  static async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      throw new Error("Failed to retrieve payment intent");
    }
  }

  /**
   * Process refund
   */
  static async processRefund(data: RefundData) {
    try {
      const { paymentIntentId, amount, reason } = data;

      // Get Payment record
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntentId,
      });
      if (!payment) {
        throw new Error("Payment not found");
      }

      // Check if payment was successful
      if (payment.status !== "succeeded") {
        throw new Error("Can only refund successful payments");
      }

      // calculate refund amount
      const refundAmount =
        amount || payment.amount - (payment.refundedAmount || 0);

      if (refundAmount <= 0) {
        throw new Error("Invalid refund amount");
      }

      // create refund in stripe

      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: refundAmount,
        reason:
          (reason as Stripe.RefundCreateParams.Reason) ||
          "requested_by_customer",
        metadata: {
          bookingId: payment.bookingId.toString(),
          userId: payment.userId.toString(),
        },
      });

      // update payment record
      payment.status =
        refundAmount === payment.amount ? "refunded" : "succeeded";
      payment.refundedAmount = (payment.refundedAmount || 0) + refundAmount;
      payment.refundReason = reason ?? "";
      await payment.save();

      // update booking status
      await Booking.findByIdAndUpdate(payment.bookingId, {
        status: "refunded",
      });

      // Send cancellation email
      const booking = await Booking.findById(payment.bookingId).populate(
        "userId",
        "email"
      );
      if (booking && booking.userId) {
        await sendBookingCancellation((booking.userId as any).email, {
          movieTitle: booking.movie.title,
          bookingId: booking.bookingReference,
          refundAmount: refundAmount / 100,
        });
      }

      return {
        refund,
        payment,
      };
    } catch (error) {
      console.error("Error processing refund:", error);
      throw new Error("Failed to process refund");
    }
  }

  /**
   * Handle Stripe webhook
   */
  static async handleWebhook(rawBody: Buffer, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentFailure(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "payment_intent.canceled":
          await this.handlePaymentCancellation(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return event;
    } catch (error) {
      console.error("Webhook error:", error);
      throw new Error("Webhook signature verification failed");
    }
  }

  /**
   * Handle successful payment
   */
  private static async handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent
  ) {
    try {
      // update payment status
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          status: "succeeded",
          paymentMethod: paymentIntent.payment_method_types?.[0],
        },
        { new: true }
      );

      if (payment) {
        // update booking status
        const booking = await Booking.findByIdAndUpdate(
          payment.bookingId,
          {
            status: "confirmed",
            paymentId: payment._id,
          },
          { new: true }
        ).populate("userId", "email fullName");

        // update movie slot availability
        if (booking) {
          const movie = await Movie.findById(booking.movieId);
          if (movie) {
            const slot = movie.slots.id(booking.slotId);
            if (slot) {
              slot.availableSeats -= booking.seats.length;
              await movie.save();
            }
          }
        }

        // Send confirmation email
        if (booking.userId) {
          await sendBookingConfirmation((booking.userId as any).email, {
            movieTitle: booking.movie.title,
            showtime: booking.showtime,
            auditorium: booking.auditorium,
            seats: booking.seats,
            totalPrice: booking.totalPrice,
            bookingId: booking.bookingReference,
          });
        }
      }

      console.log(`Payment succeeded: ${paymentIntent.id}`);
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  }

  /**
   * Handle failed payment
   */
  private static async handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent
  ) {
    try {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: "failed" }
      );

      // Update booking status to cancelled
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });
      if (payment) {
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: "cancelled",
        });
      }

      console.log(`Payment failed: ${paymentIntent.id}`);
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }

  /**
   * Handle payment cancellation
   */
  private static async handlePaymentCancellation(
    paymentIntent: Stripe.PaymentIntent
  ) {
    try {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: "cancelled" }
      );

      // Update booking status to cancelled
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });
      if (payment) {
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: "cancelled",
        });
      }

      console.log(`Payment cancelled: ${paymentIntent.id}`);
    } catch (error) {
      console.error("Error handling payment cancellation:", error);
    }
  }

  /**
   * Get Stripe publishable key for frontend
   */
  static getPublishableKey() {
    return process.env.STRIPE_PUBLISHABLE_KEY;
  }
}



export default StripeService




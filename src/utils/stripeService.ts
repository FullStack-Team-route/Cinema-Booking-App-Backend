import Stripe from "stripe";
import Payment from "../models/Payment.js";
import { Movie } from "../models/Movie.js";
import Booking from "../models/Booking.js";
import {
  sendBookingConfirmation,
  sendBookingCancellation,
} from "./emailService.js";

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
   * Create a Stripe Checkout Session for booking
   */
  static async createCheckoutSession(data: {
    bookingId: string;
    userId: string;
    amount: number;
    currency?: string;
    movieTitle: string;
    seats: string[];
    successUrl: string;
    cancelUrl: string;
  }) {
    try {
      const {
        bookingId,
        userId,
        amount,
        currency = "egp",
        movieTitle,
        seats,
        successUrl,
        cancelUrl,
      } = data;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Cinema Ticket: ${movieTitle}`,
                description: `Seats: ${seats.join(", ")}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        client_reference_id: bookingId,
        metadata: {
          bookingId: bookingId.toString(),
          userId: userId.toString(),
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      // Save Initial Payment record in database
      const payment = new Payment({
        bookingId,
        userId,
        amount: Math.round(amount * 100),
        currency,
        stripePaymentIntentId: session.id, // Using session ID as identifier before we get payment intent
        status: "pending",
        description: `Payment for booking ${bookingId} via Checkout`,
      });

      await payment.save();

      return {
        sessionId: session.id,
        sessionUrl: session.url,
        paymentId: payment._id,
      };
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  /**
   * Confirm payment intent
   */

  static async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await stripe.paymentIntents.confirm(paymentIntentId);
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
        { status: "cancelled" },
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
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);
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
      const booking = await Booking.findById(payment.bookingId)
        .populate("userId", "email")
        .populate("movieId", "title");

      if (booking && (booking.userId as any)?.email) {
        await sendBookingCancellation((booking.userId as any).email, {
          movieTitle: (booking.movieId as any).title || "Movie",
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
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(
            event.data.object as Stripe.PaymentIntent,
          );
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentFailure(
            event.data.object as Stripe.PaymentIntent,
          );
          break;

        case "payment_intent.canceled":
          await this.handlePaymentCancellation(
            event.data.object as Stripe.PaymentIntent,
          );
          break;

        case "checkout.session.completed":
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
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
    paymentIntent: Stripe.PaymentIntent,
  ) {
    try {
      // update payment status
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          status: "succeeded",
          paymentMethod: paymentIntent.payment_method_types?.[0],
        },
        { new: true },
      );

      if (payment) {
        // update booking status
        const booking = await Booking.findByIdAndUpdate(
          payment.bookingId,
          {
            status: "confirmed",
            paymentId: payment._id,
          },
          { new: true },
        )
          .populate("userId", "email fullName")
          .populate("movieId", "title");

        // Send confirmation email
        if (booking && (booking.userId as any)?.email) {
          await sendBookingConfirmation((booking.userId as any).email, {
            movieTitle: (booking.movieId as any).title || "Movie",
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
    paymentIntent: Stripe.PaymentIntent,
  ) {
    try {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: "failed" },
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
    paymentIntent: Stripe.PaymentIntent,
  ) {
    try {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: "cancelled" },
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
   * Handle checkout session completed
   */
  private static async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    try {
      console.log(
        `[StripeService] 🔔 Handling checkout.session.completed for session: ${session.id}`,
      );
      console.log(
        `[StripeService] Metadata received:`,
        JSON.stringify(session.metadata),
      );

      const { bookingId, userId } = session.metadata || {};

      if (!bookingId) {
        console.error(
          "[StripeService] ❌ No bookingId in session metadata. Cannot process payment.",
        );
        return;
      }

      console.log(`[StripeService] 🔍 Searching for payment record...`);

      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        {
          $or: [
            { stripePaymentIntentId: session.id },
            { stripePaymentIntentId: session.payment_intent as string },
          ],
        },
        {
          status: session.payment_status === "paid" ? "succeeded" : "failed",
          stripePaymentIntentId:
            (session.payment_intent as string) || session.id,
          paymentMethod: "card",
          // Store raw session data for debugging
          $set: { "metadata.stripeSession": session },
        },
        { new: true },
      );

      if (!payment) {
        console.error(
          `[StripeService] ❌ Payment record NOT FOUND. BookingId: ${bookingId}, SessionId: ${session.id}`,
        );
        // Fallback: This is critical. If payment record isn't found using session ID,
        // it might be because of a race condition or lost ID.
        // We could try to find by bookingId as a last resort?
        // Let's just log for now to identify the issue.
        return;
      }

      console.log(
        `[StripeService] ✅ Payment record updated. New Status: ${payment.status}`,
      );

      if (session.payment_status === "paid") {
        console.log(
          `[StripeService] 💰 Payment paid. Updating booking ${bookingId} to confirmed...`,
        );

        // Update booking status
        const booking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            status: "confirmed",
            paymentId: payment?._id,
          },
          { new: true },
        )
          .populate("userId", "email fullName")
          .populate("movieId", "title");

        if (booking) {
          console.log(`[StripeService] ✅ Booking confirmed: ${booking._id}`);
          // Send confirmation email
          if ((booking.userId as any)?.email) {
            console.log(
              `[StripeService] 📧 Sending confirmation email to ${(booking.userId as any).email}`,
            );
            try {
              await sendBookingConfirmation((booking.userId as any).email, {
                movieTitle: (booking.movieId as any).title || "Movie",
                showtime: booking.showtime,
                auditorium: booking.auditorium,
                seats: booking.seats,
                totalPrice: booking.totalPrice,
                bookingId: booking.bookingReference,
              });
              console.log(`[StripeService] 📧 Email sent successfully`);
            } catch (emailError: any) {
              console.error(
                `[StripeService] ⚠️ Failed to send email, but payment is successful: ${emailError.message}`,
              );
            }
          }
        } else {
          console.error(
            `[StripeService] ❌ Booking NOT FOUND with ID: ${bookingId}`,
          );
        }
      } else {
        console.warn(
          `[StripeService] ⚠️ Session payment status is NOT paid: ${session.payment_status}`,
        );
      }

      console.log(`[StripeService] ✅ Checkout session processing completed.`);
    } catch (error) {
      console.error(
        "[StripeService] ❌ Error handling checkout session completed:",
        error,
      );
    }
  }

  /**
   * Get Stripe publishable key for frontend
   */
  static getPublishableKey() {
    return process.env.STRIPE_PUBLISHABLE_KEY;
  }
}

export default StripeService;

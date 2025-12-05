import type { Request, Response } from "express";
import StripeService from "../utils/stripeService.js";

/**
 * Handle Stripe webhooks
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const rawBody = req.body;
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return res.status(400).json({ message: "Missing Stripe signature" });
    }

    // Verify and handle webhook
    const event = await StripeService.handleWebhook(rawBody, signature);

    // Return success response to Stripe
    res.json({ received: true, event: event.type });
  } catch (error: any) {
    console.error("Webhook handling error:", error);
    res.status(400).json({
      message: "Webhook error",
      error: error.message,
    });
  }
};

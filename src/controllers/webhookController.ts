import type { Request, Response } from "express";
import StripeService from "../utils/stripeService.js";

/**
 * Handle Stripe webhooks
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const rawBody = req.body;
    const signature = req.headers["stripe-signature"] as string;

    console.log("[Webhook] ✅ Webhook endpoint hit!");
    console.log("[Webhook] Signature present:", !!signature);

    // Log safe parts of the body for debugging
    try {
      if (Buffer.isBuffer(rawBody)) {
        console.log("[Webhook] Body is a Buffer (length):", rawBody.length);
      } else {
        console.log("[Webhook] Body type:", typeof rawBody);
        console.log(
          "[Webhook] Body content (preview):",
          JSON.stringify(rawBody).substring(0, 100),
        );
      }
    } catch (e) {
      console.log("[Webhook] Could not log body details");
    }

    if (!signature) {
      console.log("[Webhook] ❌ Missing Stripe signature");
      return res.status(400).json({ message: "Missing Stripe signature" });
    }

    // Verify and handle webhook
    console.log("[Webhook] 🔄 Verifying signature...");
    const event = await StripeService.handleWebhook(rawBody, signature);

    console.log("[Webhook] ✅ Event verified:", event.type);
    console.log("[Webhook] 🆔 Event ID:", event.id);

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

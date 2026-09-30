import { fulfillCheckout } from "@/lib/server/booking";
import { env } from "@/lib/server/env";
import { getStripe } from "@/lib/server/stripe";

// Stripe → POST /api/webhooks/stripe. Configure in the Stripe dashboard with the checkout.session.completed event.
export async function POST(request: Request) {
  if (!env.stripe.secretKey || !env.stripe.webhookSecret) return new Response("Webhook not configured", { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event;
  try {
    // The raw body is required for signature verification.
    event = getStripe().webhooks.constructEvent(await request.text(), signature, env.stripe.webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    try {
      const status = await fulfillCheckout(event.data.object.id);
      console.info(`[webhook] ${event.data.object.id}: ${status}`);
    } catch (error) {
      // Non-2xx makes Stripe retry later (e.g. a temporary Hostaway outage).
      console.error("[webhook] fulfilment failed", error);
      return new Response("Fulfilment failed", { status: 500 });
    }
  }
  return Response.json({ received: true });
}

import { addMinutes, format, parseISO } from "date-fns";
import { parseStayRequest, quoteStay, stayMetadata } from "@/lib/server/booking";
import { bookingEnabled, env } from "@/lib/server/env";
import { errorResponse, notConfigured } from "@/lib/server/respond";
import { getStripe } from "@/lib/server/stripe";
import { searchQuery } from "@/lib/search";

// POST /api/booking/checkout { slug, arrival, departure, adults, children, pets } → { url } of a Stripe Checkout page
export async function POST(request: Request) {
  if (!bookingEnabled()) return notConfigured();
  try {
    const stay = parseStayRequest(await request.json().catch(() => null));
    // Price is always recalculated here from Hostaway — never taken from the browser.
    const quote = await quoteStay(stay);
    const p = stay.property;
    const guests = stay.adults + stay.children;
    const dates = `${format(parseISO(stay.arrival), "EEE, MMM d")} → ${format(parseISO(stay.departure), "EEE, MMM d, yyyy")}`;
    const back = `${env.siteUrl}/properties/${p.slug}${searchQuery({
      start: parseISO(stay.arrival),
      end: parseISO(stay.departure),
      adults: stay.adults,
      children: stay.children,
      pets: stay.pets,
    })}`;
    const metadata = stayMetadata(stay, quote);
    // Fees and taxes, e.g. "cleaning fee and occupancy tax" (the nightly rate line is already "N nights").
    const extras = quote.lines.filter((l) => !/\bnights?\b/i.test(l.label)).map((l) => l.label.toLowerCase());

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      // Always charge in USD: turn off Stripe's Adaptive Pricing (local-currency options like INR).
      adaptive_pricing: { enabled: false },
      // Instant methods only (card covers Apple Pay / Google Pay). Delayed methods like US bank account (ACH)
      // take days to clear, which would leave the dates unreserved and the booking unconfirmed meanwhile.
      payment_method_types: ["card", "link"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: quote.currency.toLowerCase(),
            unit_amount: Math.round(quote.total * 100),
            product_data: {
              name: `${p.name} · ${quote.nights} night${quote.nights === 1 ? "" : "s"}`,
              description: [
                dates,
                `${guests} guest${guests === 1 ? "" : "s"}${stay.pets ? ` + ${stay.pets} pet${stay.pets === 1 ? "" : "s"}` : ""}`,
                `${quote.nights} night${quote.nights === 1 ? "" : "s"}`,
                extras.length ? `Includes ${listJoin(extras)}` : "",
              ]
                .filter(Boolean)
                .join(" · "),
              images: p.images.slice(0, 1),
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      metadata,
      payment_intent_data: { metadata, description: `${p.name}: ${stay.arrival} to ${stay.departure}` },
      expires_at: Math.floor(addMinutes(new Date(), 30).getTime() / 1000),
      success_url: `${env.siteUrl}/booking/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: back,
    });

    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return Response.json({ url: session.url });
  } catch (error) {
    return errorResponse(error, "checkout");
  }
}

/** "a", "a and b", "a, b and c" */
function listJoin(items: string[]) {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

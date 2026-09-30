import { after } from "next/server";
import { parseStayRequest, quoteStay, sweepPendingCheckouts } from "@/lib/server/booking";
import { bookingEnabled, hostawayConfigured } from "@/lib/server/env";
import { errorResponse, notConfigured } from "@/lib/server/respond";

// POST /api/booking/quote { slug, arrival, departure, adults, children, pets } → live price from Hostaway
export async function POST(request: Request) {
  if (!hostawayConfigured()) return notConfigured();
  after(() => sweepPendingCheckouts().catch((e) => console.error("[sweep]", e)));
  try {
    const stay = parseStayRequest(await request.json().catch(() => null));
    const quote = await quoteStay(stay);
    return Response.json({ enabled: bookingEnabled(), quote });
  } catch (error) {
    return errorResponse(error, "quote");
  }
}

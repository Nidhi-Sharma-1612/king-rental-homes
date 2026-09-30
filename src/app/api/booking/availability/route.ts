import { after, type NextRequest } from "next/server";
import { getBlockedNights, sweepPendingCheckouts } from "@/lib/server/booking";
import { hostawayConfigured } from "@/lib/server/env";
import { errorResponse, notConfigured } from "@/lib/server/respond";
import { getProperty } from "@/lib/properties";

// GET /api/booking/availability?slug=… → unavailable nights for the date picker
export async function GET(request: NextRequest) {
  if (!hostawayConfigured()) return notConfigured();
  const property = getProperty(request.nextUrl.searchParams.get("slug") ?? "");
  if (!property) return Response.json({ error: "Unknown home." }, { status: 404 });
  // Without a Stripe webhook, normal traffic doubles as the trigger for finishing any abandoned paid checkouts.
  after(() => sweepPendingCheckouts().catch((e) => console.error("[sweep]", e)));
  try {
    const data = await getBlockedNights(property);
    return Response.json({ enabled: true, ...data }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=120" } });
  } catch (error) {
    return errorResponse(error, "availability");
  }
}

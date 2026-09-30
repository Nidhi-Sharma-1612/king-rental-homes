import { sweepPendingCheckouts } from "@/lib/server/booking";
import { env } from "@/lib/server/env";

// Optional scheduled job: GET /api/booking/reconcile with header `Authorization: Bearer <CRON_SECRET>`.
// (Vercel Cron sends this header automatically when CRON_SECRET is set.) Finishes any paid checkouts
// that were never turned into Hostaway reservations.
export async function GET(request: Request) {
  if (!env.cronSecret) return new Response("Not configured", { status: 404 });
  if (request.headers.get("authorization") !== `Bearer ${env.cronSecret}`) return new Response("Unauthorized", { status: 401 });
  try {
    return Response.json(await sweepPendingCheckouts({ force: true }));
  } catch (error) {
    console.error("[reconcile]", error);
    return new Response("Sweep failed", { status: 500 });
  }
}

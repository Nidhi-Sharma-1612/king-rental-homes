import "server-only";
import { BookingError } from "@/lib/server/booking";

/** Turns thrown errors into safe JSON responses: guest-friendly messages, details only in server logs. */
export function errorResponse(error: unknown, context: string) {
  if (error instanceof BookingError) return Response.json({ error: error.message }, { status: error.status });
  console.error(`[${context}]`, error);
  return Response.json({ error: "Something went wrong on our side. Please try again, or contact us to book." }, { status: 502 });
}

export const notConfigured = () =>
  Response.json({ enabled: false, error: "Online booking isn't available yet. Please contact us to book." }, { status: 503 });

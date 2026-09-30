import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/server/env";

// Created lazily so builds without keys don't fail.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.stripe.secretKey) throw new Error("STRIPE_SECRET_KEY is not set");
  const mock = env.stripe.apiHost ? new URL(env.stripe.apiHost) : null;
  client ??= new Stripe(env.stripe.secretKey, {
    appInfo: { name: "King Rental Homes" },
    ...(mock && { host: mock.hostname, port: Number(mock.port), protocol: mock.protocol.replace(":", "") as "http" | "https" }),
  });
  return client;
}

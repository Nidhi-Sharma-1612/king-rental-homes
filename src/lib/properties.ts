import { properties } from "@/data/properties";
import type { Property, Region, Review } from "@/lib/types";

// Phase 2: swap these for Hostaway API calls, keeping the same signatures.

export function getProperties(): Property[] {
  return properties;
}

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertiesByRegion(region: Region): Property[] {
  return properties.filter((p) => p.region === region);
}

/** One of each kind of stay for the home page: woodland manor, beach house, Colorado. */
const FEATURED = ["stoneham-chapel-way-manor", "quincy-beach-house", "broomfield-sheridan-green-house"];

export function getFeaturedProperties(): Property[] {
  return FEATURED.map((slug) => getProperty(slug)).filter((p): p is Property => !!p);
}

export function getStats() {
  const reviewTotal = properties.reduce((sum, p) => sum + p.reviewCount, 0);
  const weighted = properties.reduce((sum, p) => sum + (p.rating ?? 0) * p.reviewCount, 0);
  return {
    homes: properties.length,
    reviewTotal,
    averageRating: reviewTotal ? Math.round((weighted / reviewTotal) * 100) / 100 : null,
    fromPrice: Math.min(...properties.map((p) => p.pricePerNight)),
  };
}

export type ReviewWithHome = Review & { home: string; slug: string };

/** Standout reviews across all homes for the home page. */
export function getFeaturedReviews(limit = 8): ReviewWithHome[] {
  const all = properties.flatMap((p) =>
    p.reviews
      .filter((r) => r.rating >= 5 && r.text.length > 140 && r.text.length < 520)
      .slice(0, 3)
      .map((r) => ({ ...r, home: p.name, slug: p.slug })),
  );
  // interleave homes so the carousel doesn't show one home in a row
  const byHome = new Map<string, ReviewWithHome[]>();
  for (const r of all) byHome.set(r.slug, [...(byHome.get(r.slug) ?? []), r]);
  const out: ReviewWithHome[] = [];
  for (let i = 0; out.length < limit && i < 3; i++) {
    for (const list of byHome.values()) if (list[i] && out.length < limit) out.push(list[i]);
  }
  return out;
}

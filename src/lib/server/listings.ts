import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { format, isValid, parseISO } from "date-fns";
import { hostawayConfigured } from "@/lib/server/env";
import { getGuestReviews, getListing, getListings, type HostawayListing, type HostawayReview } from "@/lib/server/hostaway";
import { getProperties, getProperty } from "@/lib/properties";
import type { Property, Region, Review } from "@/lib/types";

/** Listing grids (home, Properties, About…) refresh at most this often; detail pages are always live. */
const GRID_CACHE_SECONDS = 60;

const hour = (h: number | null | undefined) => (h == null || h < 0 || h > 23 ? undefined : format(new Date(2000, 0, 1, h), "h:mm a"));

const paragraphs = (text: string) =>
  text
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

function toReview(r: HostawayReview): Review {
  const d = parseISO((r.departureDate ?? r.submittedAt ?? "").slice(0, 10));
  return {
    name: (r.reviewerName ?? "Guest").trim() || "Guest",
    date: isValid(d) ? format(d, "MMMM yyyy") : "",
    rating: Math.round(((r.rating ?? 10) / 2) * 10) / 10,
    text: (r.publicReview ?? "").replace(/\s+/g, " ").trim(),
  };
}

/**
 * Hostaway is the source of truth for listing facts (title, description, photos, amenities, capacity, base price,
 * check-in/out, house rules, rating, reviews). Site-only copy (slug, display name, tagline, highlights, area) stays
 * from src/data/properties.ts. Any field Hostaway doesn't return falls back to the saved copy.
 */
function merge(base: Property, listing: HostawayListing, rawReviews: HostawayReview[] | null): Property {
  const amenities = (listing.listingAmenities ?? []).map((a) => a.amenityName).filter(Boolean);
  const images = [...(listing.listingImages ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((i) => i.url);
  const published = (rawReviews ?? []).filter((r) => r.listingMapId === base.id && r.rating && r.publicReview?.trim());
  const avg = published.length ? published.reduce((n, r) => n + (r.rating ?? 0), 0) / published.length / 2 : null;

  return {
    ...base,
    listingTitle: listing.name || base.listingTitle,
    city: listing.city || base.city,
    state: listing.state || base.state,
    guests: listing.personCapacity || base.guests,
    bedrooms: listing.bedroomsNumber ?? base.bedrooms,
    beds: listing.bedsNumber || base.beds,
    baths: listing.bathroomsNumber ?? base.baths,
    pricePerNight: listing.price ? Math.round(listing.price) : base.pricePerNight,
    description: listing.description ? paragraphs(listing.description) : base.description,
    amenities: amenities.length ? amenities : base.amenities,
    images: images.length ? images : base.images,
    petFriendly: amenities.length ? amenities.includes("Pets allowed") && !/no-pets home/i.test(listing.description ?? "") : base.petFriendly,
    rating: avg != null ? Math.round(avg * 100) / 100 : listing.averageReviewRating ? listing.averageReviewRating / 2 : base.rating,
    reviewCount: rawReviews ? published.length : base.reviewCount,
    reviews: rawReviews ? published.map(toReview).filter((r) => r.text.length >= 40) : base.reviews,
    checkInTime: hour(listing.checkInTimeStart),
    checkOutTime: hour(listing.checkOutTime),
    houseRules: listing.houseRules ? paragraphs(listing.houseRules) : undefined,
  };
}

/** One home for its detail page, fetched live on every request. Falls back to the saved copy if Hostaway is down. */
export const getLiveProperty = cache(async (slug: string): Promise<{ property: Property; live: boolean } | null> => {
  const base = getProperty(slug);
  if (!base) return null;
  if (!hostawayConfigured()) return { property: base, live: false };
  try {
    const [listing, reviews] = await Promise.all([getListing(base.id), getGuestReviews(base.id).catch(() => null)]);
    return { property: merge(base, listing, reviews), live: true };
  } catch (error) {
    unstable_rethrow(error); // let Next.js handle its own signals (e.g. "render this page per request")
    console.error(`[listing] ${slug}: Hostaway unavailable, showing saved details`, error);
    return { property: base, live: false };
  }
});

/** Every home with live Hostaway details, for cards and site-wide stats (cached briefly). */
export const getLiveProperties = cache(async (): Promise<Property[]> => {
  const saved = getProperties();
  if (!hostawayConfigured()) return saved;
  try {
    const [listings, reviews] = await Promise.all([
      getListings({ cacheSeconds: GRID_CACHE_SECONDS }),
      Promise.all(saved.map((p) => getGuestReviews(p.id, { cacheSeconds: GRID_CACHE_SECONDS }).catch(() => null))),
    ]);
    const byId = new Map(listings.map((l) => [l.id, l]));
    return saved.map((base, i) => {
      const listing = byId.get(base.id);
      return listing ? merge(base, listing, reviews[i]) : base;
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error("[listing] Hostaway unavailable, showing saved details for all homes", error);
    return saved;
  }
});

export async function getLivePropertiesByRegion(region: Region) {
  return (await getLiveProperties()).filter((p) => p.region === region);
}

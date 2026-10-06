export type Region = "boston" | "colorado";

export interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
}

/** Mirrors the Hostaway listing fields we use, so phase 2 can map the API onto it. */
export interface Property {
  /** Hostaway listing id */
  id: number;
  slug: string;
  name: string;
  listingTitle: string;
  tagline: string;
  city: string;
  state: string;
  region: Region;
  pricePerNight: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  sqft: number | null;
  rating: number | null;
  reviewCount: number;
  petFriendly: boolean;
  evCharging: boolean;
  highlights: string[];
  locationSummary: string;
  description: string[];
  amenities: string[];
  images: string[];
  reviews: Review[];
  /** From Hostaway on detail pages, e.g. "4:00 PM" */
  checkInTime?: string;
  checkOutTime?: string;
  houseRules?: string[];
}

export interface Destination {
  region: Region;
  name: string;
  short: string;
  blurb: string;
  image: string;
}

export interface Attraction {
  slug: string;
  name: string;
  region: Region;
  /** e.g. "Quincy, MA" */
  location: string;
  category: string;
  /** Path under /public */
  image: string;
  description: string;
  /** Slug used by the old kingrentalhomes.com /attractions/detail/... URL */
  legacySlug: string;
  /** Attribution for photos not supplied by King Rental Homes */
  credit?: { text: string; href: string };
}

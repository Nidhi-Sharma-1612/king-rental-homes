import type { NextConfig } from "next";

// Old kingrentalhomes.com property URLs → new slugs, so existing links and SEO keep working.
const legacyPropertyRedirects: [string, string][] = [
  ["/quiet-5br-boston-area-sanctuary-|-for-work---play-475597", "stoneham-chapel-way-manor"],
  ["/private-btwn-boulder---denver--mountains-game-room-428936", "broomfield-sheridan-green-house"],
  ["/next-to-boston---beach--king-beds--free-parking-ev-428935", "quincy-beach-house"],
  ["/beach-home-next-to-boston---t--king-bed--park-free-428934", "quincy-beachside-flat"],
  ["/home-away-from-home-|-next-to-boston---beach--ev--428933", "quincy-sun-porch-suite"],
  ["/quincy-beach-home-next-to-boston---t--free-parking-428932", "quincy-ocean-view-flat"],
];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "hostaway-platform.s3.us-west-2.amazonaws.com", pathname: "/listing/**" },
      { protocol: "https", hostname: "kingrentalhomes.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/guides", destination: "/attractions", permanent: true },
      { source: "/guides/:slug", destination: "/attractions/:slug", permanent: true },
      { source: "/things-to-do", destination: "/attractions", permanent: true },
      { source: "/things-to-do/:path*", destination: "/attractions", permanent: true },
      { source: "/meet-your-hosts", destination: "/about", permanent: true },
      { source: "/faqs", destination: "/contact", permanent: true },
      { source: "/reviews", destination: "/#reviews", permanent: true },
      ...legacyPropertyRedirects.map(([source, slug]) => ({
        source: source.replace("|", "%7C"),
        destination: `/properties/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;

import type { Destination } from "@/lib/types";

export const site = {
  name: "King Rental Homes",
  tagline: "Escape the ordinary",
  description:
    "Thoughtfully hosted vacation homes near Boston's beaches and between Boulder & Denver. Book direct with Todd & Bobbi King, hosting since 2011.",
  url: "https://kingrentalhomes.com",
  email: "todd@kingrentalhomes.com",
  phone: "+1 720 352 3671",
  phoneHref: "tel:+17203523671",
  established: 2011,
  // TODO: add a photo of Todd, Bobbi & Albert (e.g. "/hosts.jpg" in /public). Until then the
  // "Meet your hosts" section shows the Chapel Way Manor exterior.
  hostPhoto: undefined as string | undefined,
  checkIn: "4:00 PM",
  checkOut: "10:00 AM",
  // TODO: add the real profile URLs. The footer icons show either way; empty ones link to "#".
  socials: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Co Hosting", href: "/co-hosting" },
  { label: "Attractions", href: "/attractions" },
  { label: "Contact Us", href: "/contact" },
];

const img = (key: string) => `https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/${key}`;

/** Hand-picked shots from the property galleries, used across marketing sections. */
export const photos = {
  beachSkyline: img("168077-428935-vFiVVx5Ft0AyumKb5dfkA2Bx3aOPH3by-YqVeMJkioU-68b6349fc531c"),
  wollastonSign: img("168077-428935-R9i--Femf0-XOSXgGsCQ580uFxiyhXD3t4Xa1hdrelso-68b634b4eb4c2"),
  sunset: img("168077-428934-6-vj-e4PJwjwbhtGwetkIRP7cARNzznrzNrLUEQOwZE-68b63503ea3ed"),
  beach: img("168077-428934-cTJphIBO-qbkWyKvmaM--Po3hdK3xKXVQNXkrbyY0mBY-68b6350730534"),
  coPatio: img("168077-428936-O-DjbHs-Ss1ZQL13RayNjd6IdGWIxD2khU-9hBlWM9M-68b6345942f5d"),
  coGameRoom: img("168077-428936-G7bZZOtqLXOI0VZp1g--VTaS5KhZ-DQUtloy3lencYpA-68b63457f3531"),
  coLiving: img("168077-428936-GLL--3vniHTjQxvVdo9h3WzvZb7G4MuOZsCnJEzo1--4I-68b6346241ad1"),
  coDesk: img("168077-428936-rKanVXwCdy1vn3Kyp-tkSQJGDrlGAVdY2kz9KshkO1Q-68b63444dc171"),
  stonehamExterior: img("168077-475597-r-Tp3QBOZA5Kma0pCqxkGff1e3jZBxvjDgKpCjyt3W0-6a3a606fd04d9"),
  stonehamLiving: img("168077-475597-mqEWBZnncjVm-Ci3JwS8rqCnSGH06jJpfOLiUxef-iA-6965b54f83860"),
  stonehamDining: img("168077-475597-gTwtukQvqhz0EXXoZSmkSdqEoidkSRuPkujbtaP42pw-6965b52880cb2"),
  quincyGarden: img("168077-428932-h9fpUptYPiLskVhIo7O9awg-OgQkPidE73-s8LasIYY-68b6356c4a4bd"),
  oceanView: img("168077-428932-45SeUZRuqHAVJNXN8dws-72AQtEQTEwAOSCkxx2yuVA-68b63557f2147"),
  backyard: img("168077-428935-x2cW1Iu0Yss8E7mGxJL--iOSlrqYdSMKvWg-l1n--4aT8-68b634b89c7a1"),
  patio: img("168077-428935-uw530pZCKogM1KrzDvkUPs856otsRmETiOqvyHDKoBs-68b63c321a566"),
  coffee: img("168077-428935-K4hl0bM7HEHsNfOqF4yoTLmsLONT8kfn6v-2YeFmmnY-68b634be0ba6b"),
};

export const destinations: Destination[] = [
  {
    region: "boston",
    name: "Boston & the South Shore",
    short: "Boston & Coast",
    blurb:
      "Beach flats in Quincy, a short walk from the sand and a short ride into the city. There's also a woodland manor beside the Middlesex Fells.",
    image: photos.beachSkyline,
  },
  {
    region: "colorado",
    name: "Boulder & Denver",
    short: "Colorado",
    blurb:
      "A renovated family home on Colorado's Front Range, between two great cities with the Rockies on the horizon.",
    image: photos.coLiving,
  },
];

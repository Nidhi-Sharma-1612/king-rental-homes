import type { Attraction, Region } from "@/lib/types";

// From kingrentalhomes.com/attractions. Photos are served from public/attractions.
// The live site reused the Pearl Street photo for Union Station and Red Rocks, so those two
// use credited Wikimedia Commons photos instead.
export const attractions: Attraction[] = [
  {
    "slug": "denver-union-station",
    "name": "Denver Union Station",
    "region": "colorado",
    "location": "Denver, CO",
    "category": "Food & Shopping",
    "image": "/attractions/denver-union-station.jpg",
    "description": "Denver Union Station is a beautifully restored historic landmark that serves as the city's premier transportation hub and a vibrant destination for dining, shopping, and entertainment. Originally opened in 1881, the station features the elegant Great Hall, boutique shops, local restaurants, cafés, and a luxury hotel, blending historic architecture with modern amenities. Visitors can relax with a coffee, enjoy award-winning cuisine, or use the station as a convenient gateway to downtown Denver and nearby attractions. Whether you're arriving by train or simply exploring the city, Denver Union Station offers a unique mix of history, culture, and urban charm.",
    "legacySlug": "Denver Union Station",
    "credit": {
      "text": "Photo: Sarah Stierch, CC BY 4.0",
      "href": "https://commons.wikimedia.org/wiki/File:Denver_Union_Station_-_June_2022_-_Sarah_Stierch_01.jpg"
    }
  },
  {
    "slug": "red-rocks-park-and-amphitheatre",
    "name": "Red Rocks Park and Amphitheatre",
    "region": "colorado",
    "location": "Morrison, CO",
    "category": "Music & Outdoors",
    "image": "/attractions/red-rocks-park-and-amphitheatre.jpg",
    "description": "Red Rocks Park and Amphitheatre is one of Colorado's most iconic natural landmarks, renowned for its breathtaking red sandstone formations and world-famous open-air concert venue. Surrounded by stunning mountain scenery, the park offers scenic hiking trails, panoramic viewpoints, and opportunities to spot local wildlife. Visitors can tour the historic amphitheatre, explore the Visitor Center, or attend unforgettable live performances under the stars. Just a short drive from Denver, Red Rocks is a must-visit destination for nature lovers, outdoor enthusiasts, and music fans alike.",
    "legacySlug": "Red Rocks Park and Amphitheatre",
    "credit": {
      "text": "Photo: Jesse Goodier, public domain",
      "href": "https://commons.wikimedia.org/wiki/File:Red_Rocks_Amphitheatre_Panoramic.jpg"
    }
  },
  {
    "slug": "pearl-street-mall",
    "name": "Pearl Street Mall, Boulder",
    "region": "colorado",
    "location": "Boulder, CO",
    "category": "Shopping & Dining",
    "image": "/attractions/pearl-street-mall.jpg",
    "description": "The Pearl Street Mall is the vibrant heart of downtown Boulder, offering a lively pedestrian-friendly experience filled with shopping, dining, and entertainment. Stretching across four scenic blocks, the mall features unique local boutiques, art galleries, charming cafés, and award-winning restaurants. Visitors can enjoy live street performances, seasonal events, and beautiful views of the nearby Flatirons, creating a welcoming atmosphere year-round. Whether you're shopping for local treasures, enjoying outdoor dining, or simply taking in the energetic ambiance, Pearl Street Mall is one of Boulder’s must-visit destinations.",
    "legacySlug": "Pearl Street Mall, Boulder"
  },
  {
    "slug": "boston-duck-boat-tours",
    "name": "Boston Duck Boat Tours",
    "region": "boston",
    "location": "Boston, MA",
    "category": "Tours",
    "image": "/attractions/boston-duck-boat-tours.jpg",
    "description": "The Boston Duck Boat Tours offer one of the city's most unique sightseeing experiences, combining a guided tour on both land and water. Aboard an authentic World War II-style amphibious vehicle, visitors travel through Boston's historic neighborhoods before splashing into the Charles River for breathtaking views of the city skyline. Along the way, entertaining guides share fascinating stories, local history, and fun facts about Boston's famous landmarks. Perfect for families, couples, and first-time visitors, the Duck Boat Tour is an exciting and memorable way to explore the city's rich history and vibrant waterfront.",
    "legacySlug": "Boston Duck Boat Tours"
  },
  {
    "slug": "uss-constitution-and-museum",
    "name": "USS Constitution & Museum",
    "region": "boston",
    "location": "Charlestown, MA",
    "category": "History",
    "image": "/attractions/uss-constitution-and-museum.jpg",
    "description": "The USS Constitution & Museum is one of Boston’s most treasured historic attractions, offering visitors a chance to explore the world’s oldest commissioned naval warship still afloat. Nicknamed \"Old Ironsides,\" the ship played a significant role in the War of 1812 and remains an enduring symbol of American naval history. Guests can tour the beautifully preserved vessel, interact with knowledgeable Navy personnel, and visit the adjacent museum featuring engaging exhibits, hands-on activities, and fascinating stories about the ship’s legacy. Located in the historic Charlestown Navy Yard, this attraction is a must-visit for history enthusiasts and families alike.",
    "legacySlug": "uss-constitution&museum"
  },
  {
    "slug": "adams-national-historical-park",
    "name": "Adams National Historical Park",
    "region": "boston",
    "location": "Quincy, MA",
    "category": "History",
    "image": "/attractions/adams-national-historical-park.jpg",
    "description": "A historic park preserving the homes of U.S. Presidents John Adams and John Quincy Adams, showcasing over 200 years of American history. Guided tours bring the legacy of the Adams family to life.",
    "legacySlug": "adams-national-historical-park"
  },
  {
    "slug": "wollaston-beach",
    "name": "Wollaston Beach",
    "region": "boston",
    "location": "Quincy, MA",
    "category": "Beaches",
    "image": "/attractions/wollaston-beach.jpg",
    "description": "One of the closest and most popular spots—perfect for walking, relaxing, or enjoying ocean views.",
    "legacySlug": "wollaston-beach"
  },
  {
    "slug": "freedom-trail",
    "name": "Freedom Trail",
    "region": "boston",
    "location": "Boston, MA",
    "category": "History",
    "image": "/attractions/freedom-trail.jpg",
    "description": "The Freedom Trail is a 2.5-mile historic walking route that connects 16 of Boston's most significant landmarks. Marked by a distinctive red-brick path, it takes visitors through centuries of American history, including sites from the Revolutionary War. Along the trail, you'll discover historic churches, meeting houses, museums, and cemeteries that tell the story of the nation's founding. Whether you're a history enthusiast or a first-time visitor, the Freedom Trail offers an unforgettable journey through Boston's rich heritage.",
    "legacySlug": "freedom_trail"
  },
  {
    "slug": "boston-common-and-public-garden",
    "name": "Boston Common & Public Garden",
    "region": "boston",
    "location": "Boston, MA",
    "category": "Parks",
    "image": "/attractions/boston-common-and-public-garden.jpg",
    "description": "Boston Common and the adjacent Public Garden form the heart of downtown Boston and are among the city's most beloved green spaces. Established in 1634, Boston Common is the oldest public park in the United States, while the Public Garden is famous for its beautifully landscaped gardens, colorful seasonal flowers, and iconic Swan Boats. Visitors can enjoy peaceful walking paths, scenic ponds, historic monuments, and plenty of open space for picnics or relaxation. Whether you're exploring the city, taking family photos, or simply enjoying a quiet afternoon, these parks offer a perfect escape in the center of Boston.",
    "legacySlug": "boston-common-public_Garden"
  },
  {
    "slug": "faneuil-hall-marketplace-and-quincy-market",
    "name": "Faneuil Hall Marketplace & Quincy Market",
    "region": "boston",
    "location": "Boston, MA",
    "category": "Food & Shopping",
    "image": "/attractions/faneuil-hall-marketplace-and-quincy-market.jpg",
    "description": "Faneuil Hall Marketplace and Quincy Market are two of Boston's most vibrant destinations, combining history, shopping, dining, and entertainment in one iconic location. Often referred to as the \"Cradle of Liberty,\" Faneuil Hall has played a significant role in American history, while Quincy Market is famous for its lively food hall featuring a wide variety of local and international cuisine. Visitors can browse unique boutiques, enjoy live street performances, and experience the energetic atmosphere throughout the year. Located along the Freedom Trail, this historic marketplace is a must-visit destination for families, couples, and anyone looking to experience the best of Boston.",
    "legacySlug": "Faneuil hall-marketplace-quincy-market"
  },
  {
    "slug": "fenway-park",
    "name": "Fenway Park",
    "region": "boston",
    "location": "Boston, MA",
    "category": "Sports",
    "image": "/attractions/fenway-park.jpg",
    "description": "Fenway Park is one of the most iconic baseball stadiums in the United States and the historic home of the Boston Red Sox since 1912. Known for its legendary Green Monster left-field wall, the ballpark offers a unique blend of rich history and unforgettable game-day excitement. Visitors can take guided tours to explore the stadium, learn about its storied past, and enjoy behind-the-scenes access to one of Major League Baseball's most cherished venues. Whether you're a baseball fan or simply exploring Boston, Fenway Park is a must-see landmark that captures the city's passion for sports and tradition.",
    "legacySlug": "fenway-park"
  },
  {
    "slug": "the-north-end",
    "name": "The North End (Little Italy)",
    "region": "boston",
    "location": "Boston, MA",
    "category": "Food & Culture",
    "image": "/attractions/the-north-end.jpg",
    "description": "The North End, often referred to as Boston's Little Italy, is one of the city's oldest and most charming neighborhoods. Famous for its authentic Italian restaurants, bakeries, cafés, and lively atmosphere, it's the perfect place to enjoy homemade pasta, fresh seafood, and legendary cannoli. Visitors can stroll along the historic cobblestone streets, explore landmarks like the Old North Church, and experience a unique blend of colonial history and Italian culture. Whether you're dining, sightseeing, or simply soaking in the neighborhood's vibrant character, the North End offers an unforgettable Boston experience.",
    "legacySlug": "the-north-end"
  },
  {
    "slug": "new-england-aquarium",
    "name": "New England Aquarium",
    "region": "boston",
    "location": "Boston, MA",
    "category": "Family",
    "image": "/attractions/new-england-aquarium.jpg",
    "description": "The New England Aquarium is one of Boston's premier waterfront attractions, offering an unforgettable experience for visitors of all ages. Home to thousands of marine animals, the aquarium features the spectacular Giant Ocean Tank, playful penguins, sea turtles, sharks, colorful tropical fish, and fascinating interactive exhibits. Guests can also enjoy seasonal whale watching cruises departing directly from the aquarium's dock for an even closer look at New England's incredible marine life. Located on Boston Harbor, the New England Aquarium is a must-visit destination for families, ocean enthusiasts, and anyone looking to explore the wonders of the underwater world.",
    "legacySlug": "new-england-aquarium"
  }
];

/** Hand-picked for the home page bento, in display order (the first one gets the large tile). */
const FEATURED = ["wollaston-beach", "red-rocks-park-and-amphitheatre", "freedom-trail", "pearl-street-mall", "uss-constitution-and-museum", "faneuil-hall-marketplace-and-quincy-market"];

export function getFeaturedAttractions(): Attraction[] {
  return FEATURED.map((slug) => getAttraction(slug)).filter((a): a is Attraction => !!a);
}

export function getAttraction(slug: string) {
  return attractions.find((a) => a.slug === slug);
}

export function getAttractionsByRegion(region: Region) {
  return attractions.filter((a) => a.region === region);
}

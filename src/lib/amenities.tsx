import {
  Baby,
  Bath,
  Car,
  CircleCheck,
  Coffee,
  CookingPot,
  Flame,
  Gamepad2,
  Laptop,
  PawPrint,
  PlugZap,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Trees,
  Tv,
  WashingMachine,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const rules: [RegExp, LucideIcon][] = [
  [/wi-?fi|internet|wireless/i, Wifi],
  [/air condition|fan/i, Snowflake],
  [/heating|fireplace/i, Flame],
  [/kitchen|oven|stove|microwave|toaster|dishwasher|refrigerator|freezer|blender|cooking|baking|rice|kettle|utensils|spices/i, CookingPot],
  [/coffee|tea|wine/i, Coffee],
  [/washing|dryer|drying|iron|laundry/i, WashingMachine],
  [/workspace|desk|office|laptop/i, Laptop],
  [/tv|sound|streaming/i, Tv],
  [/game|ping pong|toys|books|board/i, Gamepad2],
  [/pet/i, PawPrint],
  [/parking|garage|car\b/i, Car],
  [/\bev\b|charg/i, PlugZap],
  [/crib|infant|child|baby|high chair|stair|pack n play/i, Baby],
  [/smoke|carbon|first aid|extinguisher|deadbolt|safety/i, ShieldCheck],
  [/beach|whale|water/i, Waves],
  [/garden|backyard|patio|deck|balcony|outdoor|grill|barbeque|bird|wildlife/i, Trees],
  [/shampoo|soap|conditioner|shower|tub|towel|hair|toilet|hot water/i, Bath],
  [/clean|linen|pillow|essentials|hanger/i, Sparkles],
];

export function amenityIcon(name: string): LucideIcon {
  return rules.find(([re]) => re.test(name))?.[1] ?? CircleCheck;
}

const groups: [string, RegExp][] = [
  ["Essentials", /wi-?fi|internet|wireless|air condition|heating|essentials|linens|towels|hangers|hot water|pillow|shades|fan|clothing|iron|washing|dryer|drying/i],
  ["Kitchen & dining", /kitchen|oven|stove|microwave|toaster|dishwasher|refrigerator|freezer|blender|cooking|baking|rice|kettle|utensils|spices|coffee|tea|wine|dining|dinnerware|dishes/i],
  ["Work & entertainment", /workspace|desk|office|laptop|tv|sound|game|ping pong|books|board|toys/i],
  ["Family", /crib|infant|child|baby|high chair|stair|pack n play|family/i],
  ["Outdoors & parking", /garden|backyard|patio|deck|balcony|outdoor|grill|barbeque|parking|garage|\bcar\b|beach|\bev\b/i],
  ["Safety", /smoke|carbon|first aid|extinguisher|deadbolt|lighting|guards/i],
];

// Hostaway lists a few "amenities" that are really tags. Keep them out of the UI.
const hidden = /^(internet|family|romantic|shopping|bird watching|whale watching|wildlife viewing|car recommended|toilet|shower|24-hour checkin)$/i;

export function groupAmenities(list: string[]) {
  const visible = list.filter((a) => !hidden.test(a));
  const result = new Map<string, string[]>();
  for (const a of visible) {
    const group = groups.find(([, re]) => re.test(a))?.[0] ?? "Comfort & convenience";
    result.set(group, [...(result.get(group) ?? []), a]);
  }
  return { visible, groups: [...result.entries()] };
}

/** A short, meaningful list for cards/summary rows. */
const priority = [
  /wi-?fi speed|free wifi/i,
  /laptop friendly workspace/i,
  /^kitchen$/i,
  /free parking/i,
  /washing machine/i,
  /air conditioning/i,
  /pets allowed/i,
  /smart tv|^tv$/i,
  /outdoor grill/i,
  /garden or backyard/i,
  /ping pong|board games/i,
  /baby crib|pack n play/i,
];

export function topAmenities(list: string[], limit = 8) {
  const out: string[] = [];
  for (const re of priority) {
    const hit = list.find((a) => re.test(a));
    if (hit && !out.includes(hit)) out.push(hit);
    if (out.length === limit) break;
  }
  return out;
}

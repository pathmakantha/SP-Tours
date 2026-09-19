import credits from "./photo-credits.json";

export interface PhotoInfo {
  /** Key into photo-credits.json, and the file name under /public/photos. */
  key: string;
  alt: string;
}

export interface PhotoCredit {
  key: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

const p = (key: string, alt: string): PhotoInfo => ({ key, alt });

/**
 * Photos are looked up by the design's placeholder label, so every place that
 * used to render a labelled placeholder picks up its real image automatically.
 * Alt text describes what the photo actually shows.
 */
export const PHOTOS: Record<string, PhotoInfo> = {
  // Home hero
  "Sigiriya rock at sunrise": p("sigiriya-sunrise", "Sigiriya rock rising above the jungle at sunrise"),
  "Tea picker, hill country": p("tea-pickers", "Tea pluckers working a hillside estate"),
  "Leopard, Yala": p("leopard-hero", "Sri Lankan leopard walking through Yala National Park"),

  // Home gallery
  "Stilt fishermen, Koggala": p("stilt-fishermen", "Stilt fishermen perched over the surf at Koggala"),
  "Kandy lake": p("kandy-lake", "Kandy lake and hillside town seen from above"),
  "Nine Arch Bridge": p("nine-arch", "A blue train crossing the Nine Arch Bridge near Ella"),
  "Rice & curry spread": p("rice-curry", "A plate of rice and curry"),
  "Elephants, Udawalawe": p("elephants", "Elephants and a calf grazing beside a lake"),
  "Galle rampart sunset": p("galle-sunset", "Galle Fort ramparts at sunset"),
  "Tea estate morning mist": p("tea-mist", "Tea bushes in morning mist"),

  // Destination pages
  "Sigiriya rock from the water gardens, 3:2": p("sigiriya-gardens", "The water gardens at Sigiriya"),
  "Dambulla cave ceiling frescoes, 4:5": p("dambulla-cave", "Painted ceiling and Buddha statues in a Dambulla cave temple"),
  "Polonnaruwa ruins at dawn, 4:5": p("polonnaruwa", "Carved brickwork of a Polonnaruwa ruin"),
  "Village lake canoe lunch, 3:2": p("village-lake", "A small boat on a calm lake at dusk"),
  "Nine Arch Bridge with train, 3:2": p("nine-arch", "A blue train crossing the Nine Arch Bridge near Ella"),
  "Tea pluckers on a slope, 4:5": p("tea-pickers", "Tea pluckers working a hillside estate"),
  "Blue train window, hill country, 4:5": p("hill-train", "Tea country and mountains seen from the hill-country train"),
  "Ella Gap at sunrise, 3:2": p("ella-gap", "Sun rising over the Ella Gap"),
  "Leopard on a rock, Yala, 3:2": p("leopard-rock", "Sri Lankan leopard walking on a rock in Yala"),
  "Elephant herd, Udawalawe, 4:5": p("elephants", "Elephants and a calf grazing beside a lake"),
  "Jeep track at dawn, 4:5": p("jeep-safari", "Safari jeeps on a forest track in Yala"),
  "Painted storks at a waterhole, 3:2": p("painted-storks", "Painted storks wading in a waterhole"),
  "Galle Fort lighthouse at dusk, 3:2": p("galle-lighthouse", "Galle Fort lighthouse and ramparts at dusk"),
  "Blue whale fluke off Mirissa, 4:5": p("blue-whale", "A blue whale surfacing off Mirissa"),
  "Stilt fishermen, Koggala, 4:5": p("stilt-fishermen", "Stilt fishermen perched over the surf at Koggala"),
  "Palm-lined bay, Hiriketiya, 3:2": p("beach-bay", "Golden sand and surf on the south coast"),
  "Galle Face Green at sunset, 3:2": p("galle-face", "Sunset over the sea at Galle Face, Colombo"),
  "Pettah market stall, 4:5": p("pettah", "Bags of red spice piled at a Pettah market stall"),
  "Geoffrey Bawa interior, 4:5": p("bawa", "A whitewashed corridor at Geoffrey Bawa's Number 11, Colombo"),
  "Street kottu being cooked, 3:2": p("kottu", "Kottu being chopped and cooked on a street griddle"),
};

const CREDITS = credits as Record<string, Omit<PhotoCredit, "key">>;

export function getPhoto(label: string): PhotoInfo | undefined {
  return PHOTOS[label];
}

/** Credits for every photo in use, one per file, in a stable order. */
export function allCredits(): PhotoCredit[] {
  const used = new Set(Object.values(PHOTOS).map((ph) => ph.key));
  return Object.entries(CREDITS)
    .filter(([key]) => used.has(key))
    .map(([key, c]) => ({ key, ...c }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

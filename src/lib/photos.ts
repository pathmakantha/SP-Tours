// Maps design image-slot ids to real photo files in public/images/.
// Every file referenced here must have a matching entry in photo-credits.json.

export const HERO_PHOTOS = {
  sigiriya: "hero-sigiriya.jpg",
  teaPicker: "hero-tea-picker.jpg",
  leopard: "hero-leopard-yala.jpg",
} as const;

export const GALLERY_PHOTOS = [
  { file: "gallery-1-stilt-fishermen.jpg", alt: "Stilt fishermen, Koggala" },
  { file: "dest-sigiriya-3.jpg", alt: "Polonnaruwa ruins" },
  { file: "gallery-3-nine-arch-bridge.jpg", alt: "Train crossing Nine Arch Bridge" },
  { file: "gallery-4-rice-curry.jpg", alt: "Rice & curry spread" },
  { file: "reg-wildlife.jpg", alt: "Elephants, Udawalawe" },
  { file: "gallery-6-galle-sunset.jpg", alt: "Galle rampart sunset" },
  { file: "gallery-7-tea-estate-mist.jpg", alt: "Tea estate morning mist" },
] as const;

export const ABOUT_TEAM_PHOTO = "about-team.jpg";

/** 4 photos per destination, matching each DESTINATIONS[slug].photos order. */
export const DEST_PHOTOS: Record<string, [string, string, string, string]> = {
  sigiriya: [
    "dest-sigiriya-1.jpg",
    "reg-cultural.jpg",
    "dest-sigiriya-3.jpg",
    "dest-sigiriya-4.jpg",
  ],
  ella: [
    "dest-ella-1.jpg",
    "hero-tea-picker.jpg",
    "dest-ella-3.jpg",
    "why-driver-road.jpg",
  ],
  "yala-safari": [
    "dest-yala-1.jpg",
    "reg-wildlife.jpg",
    "dest-yala-3.jpg",
    "dest-yala-4.jpg",
  ],
  "galle-mirissa": [
    "dest-coast-1.jpg",
    "dest-coast-2.jpg",
    "dest-coast-3.jpg",
    "dest-coast-4.jpg",
  ],
  colombo: [
    "dest-colombo-1.jpg",
    "dest-colombo-2.jpg",
    "reg-colombo-b.jpg",
    "dest-colombo-4.jpg",
  ],
};

export function destPhoto(slug: string, index: 0 | 1 | 2 | 3): string {
  return DEST_PHOTOS[slug]?.[index] ?? DEST_PHOTOS.sigiriya[index];
}

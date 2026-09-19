import raw from "./site-data.json";
import type { Locale } from "@/i18n/routing";
import type {
  DestinationData,
  FaqItem,
  HopData,
  InterestData,
  LocalizedPair,
  PaceData,
  RegionData,
  Starter,
} from "./types";

export const REGIONS = raw.REGIONS as unknown as Record<string, RegionData>;
export const INTERESTS = raw.INTERESTS as unknown as InterestData[];
export const PACES = raw.PACES as unknown as PaceData[];
export const HOPS = raw.HOPS as unknown as Record<string, HopData>;
export const DESTINATIONS = raw.DESTINATIONS as unknown as Record<
  string,
  DestinationData
>;
export const DEST_ORDER = raw.DEST_ORDER as string[];
export const ROUTE = raw.ROUTE as string[];
/** Extra day templates used once a region's own days run out, so no day repeats. */
export const FILLERS = raw.FILLERS as unknown as Record<string, LocalizedPair[]>;
export const STARTERS = raw.STARTERS as unknown as Starter[];
export const FAQ = raw.FAQ as unknown as FaqItem[];
export const CONTACT = raw.CONTACT as { phone: string; tel: string; email: string };

export interface DestListItem {
  slug: string;
  href: string;
  tint: string;
  name: string;
  short: string;
  tagline: string;
  region: string;
  interest: string;
  stay: string;
  photo: string;
  regionKey: string;
}

export function destList(locale: Locale): DestListItem[] {
  return DEST_ORDER.map((slug) => {
    const d = DESTINATIONS[slug];
    return {
      slug,
      href: `/destinations/${slug}`,
      tint: d.tintVar,
      name: d.name[locale],
      short: d.short[locale],
      tagline: d.tagline[locale],
      region: REGIONS[d.region].label[locale],
      regionKey: d.region,
      interest: d.interest,
      stay: d.facts[locale][1][1],
      photo: d.photos[0],
    };
  });
}

export function getDestination(slug: string): DestinationData | undefined {
  return DESTINATIONS[slug];
}

import type { Locale } from "@/i18n/routing";

export type LocalizedString = Record<Locale, string>;
export type LocalizedPair = Record<Locale, [string, string]>;

export interface RegionData {
  tint: string;
  tintVar: string;
  tintInk: string;
  label: LocalizedString;
  days: LocalizedPair[];
}

export interface InterestData {
  id: string;
  w: Record<string, number>;
  label: LocalizedString;
  blurb: LocalizedString;
}

export interface PaceData {
  id: string;
  mark: string;
  maxRegions: number;
  minDays: number;
  label: LocalizedString;
  blurb: LocalizedString;
}

export interface HopData extends LocalizedString {
  h: number;
}

export interface DestinationData {
  slug: string;
  file: string;
  region: string;
  interest: string;
  tint: string;
  tintVar: string;
  photos: [string, string, string, string];
  nearby: string[];
  name: LocalizedString;
  short: LocalizedString;
  tagline: LocalizedString;
  intro1: LocalizedString;
  intro2: LocalizedString;
  hi: LocalizedPair[];
  facts: Record<Locale, [string, string][]>;
  meta: LocalizedString;
}

export interface DraftState {
  step: 1 | 2 | 3 | 4;
  days: number;
  interests: string[];
  pace: string;
  startDate: string;
  group: number;
  note: string;
  /** Regions the visitor removed / added by hand in the draft itinerary. */
  excluded: string[];
  included: string[];
  /** Per-region day counts the visitor set with the − / + steppers. */
  dayOverride: Record<string, number>;
}

export interface Starter {
  id: string;
  days: number;
  interests: string[];
  pace: string;
  name: LocalizedString;
  blurb: LocalizedString;
}

export interface FaqItem {
  q: LocalizedString;
  a: LocalizedString;
}

export interface PlanLegDay {
  n: number;
  tag: string;
  title: string;
  place: string;
}

export interface PlanLeg {
  key: string;
  label: string;
  tint: string;
  dot: string;
  dayRange: string;
  days: PlanLegDay[];
  hop: string;
  editable: boolean;
}

export interface Plan {
  legs: PlanLeg[];
  order: string[];
  drive: number;
  pace: PaceData;
}

import type { Locale } from "@/i18n/routing";
import { HOPS, INTERESTS, PACES, REGIONS, ROUTE } from "./site-data";
import type { DraftState, Plan, PlanLeg } from "./types";

export const DEFAULT_DRAFT: DraftState = {
  step: 1,
  days: 10,
  interests: ["culture", "hills"],
  pace: "balanced",
  startDate: "",
  group: 2,
  note: "",
};

/** Site copy needed by the planner, as the flat "site" message namespace. */
export type SiteStrings = Record<string, string>;

function dayRange(locale: Locale, T: SiteStrings, a: number, b: number) {
  if (locale === "zh") return a === b ? `第 ${a} 天` : `第 ${a}–${b} 天`;
  return a === b ? `${T.dayS} ${a}` : `${T.dayP} ${a}–${b}`;
}

export function buildPlan(
  draft: DraftState,
  locale: Locale,
  T: SiteStrings,
): Plan {
  const pace = PACES.find((p) => p.id === draft.pace) ?? PACES[1];
  const weights: Record<string, number> = {};
  const chosen = INTERESTS.filter((i) => draft.interests.includes(i.id));
  const pool = chosen.length
    ? chosen
    : [INTERESTS[0], INTERESTS[3], INTERESTS[2]];
  pool.forEach((i) => {
    Object.keys(i.w).forEach((r) => {
      weights[r] = (weights[r] || 0) + i.w[r];
    });
  });

  const ranked = Object.keys(weights)
    .sort((a, b) => weights[b] - weights[a])
    .slice(0, pace.maxRegions);
  const arrival = draft.days >= 3;
  const budget = draft.days - (arrival ? 1 : 0);
  while (ranked.length > 1 && budget < ranked.length * pace.minDays) {
    ranked.pop();
  }

  const order = ROUTE.filter((r) => ranked.includes(r));
  const totalW = order.reduce((a, r) => a + weights[r], 0) || 1;
  const alloc: Record<string, number> = {};
  let used = 0;
  order.forEach((r, idx) => {
    let n = Math.max(pace.minDays, Math.round((weights[r] / totalW) * budget));
    if (idx === order.length - 1) n = Math.max(1, budget - used);
    alloc[r] = n;
    used += n;
  });
  let over = used - budget;
  let gi = order.length - 1;
  while (over > 0 && gi >= 0) {
    const r = order[gi];
    const take = Math.min(over, Math.max(0, alloc[r] - 1));
    alloc[r] -= take;
    over -= take;
    gi--;
  }

  const legs: PlanLeg[] = [];
  let dayNo = 1;
  let drive = 0;
  const tag = (n: number) => (locale === "zh" ? "D" : T.dayTag) + n;

  if (arrival) {
    const first = order.length ? HOPS[`colombo>${order[0]}`] : null;
    legs.push({
      key: "arrive",
      label: T.arrival,
      tint: "#9FB8C4",
      dayRange: dayRange(locale, T, 1, 1),
      days: [{ n: 1, tag: tag(1), title: T.arrTitle, place: T.arrPlace }],
      hop: first ? first[locale] : "",
    });
    if (first) drive += first.h;
    dayNo = 2;
  }

  order.forEach((r, idx) => {
    const reg = REGIONS[r];
    const n = alloc[r];
    const days = [];
    for (let i = 0; i < n; i++) {
      const tpl = reg.days[i % reg.days.length][locale];
      days.push({ n: dayNo, tag: tag(dayNo), title: tpl[0], place: tpl[1] });
      dayNo++;
    }
    const nextKey = idx < order.length - 1 ? `${r}>${order[idx + 1]}` : null;
    let hopText = T.returnLeg;
    if (nextKey && HOPS[nextKey]) {
      hopText = HOPS[nextKey][locale];
      drive += HOPS[nextKey].h;
    }
    legs.push({
      key: r,
      label: reg.label[locale],
      tint: reg.tint,
      dayRange: dayRange(locale, T, days[0].n, days[n - 1].n),
      days,
      hop: hopText,
    });
  });

  if (order.length) {
    const last = order[order.length - 1];
    const back = HOPS[`${last}>colombo`] ?? HOPS[`colombo>${last}`];
    drive += back ? back.h : 3;
  }

  return { legs, order, drive: Math.round(drive), pace };
}

export function planMessage(
  draft: DraftState,
  plan: Plan,
  locale: Locale,
  T: SiteStrings,
): string {
  const lines = plan.legs.map(
    (l) =>
      `${l.dayRange}: ${l.label} — ${l.days.map((d) => d.title).join("; ")}`,
  );
  const interestLabel = draft.interests.length
    ? INTERESTS.filter((i) => draft.interests.includes(i.id))
        .map((i) => i.label[locale])
        .join(", ")
    : T.waOpen;

  return [
    T.waHi,
    "",
    `${T.waLen}: ${draft.days} ${T.daysWord}`,
    `${T.waInt}: ${interestLabel}`,
    `${T.waPace}: ${plan.pace.label[locale]}`,
    `${T.waTrav}: ${draft.group}`,
    `${T.waStart}: ${draft.startDate || T.waFlex}`,
    draft.note ? `${T.waNotes}: ${draft.note}` : "",
    "",
    `${T.waRoute}:`,
    lines.join("\n"),
    "",
    `${T.waDrive} ${plan.drive} ${T.waHours}`,
    T.waAsk,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

export function planHref(
  waNumber: string,
  draft: DraftState,
  plan: Plan,
  locale: Locale,
  T: SiteStrings,
): string {
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(
    planMessage(draft, plan, locale, T),
  )}`;
}

export function waSimpleHref(waNumber: string, T: SiteStrings): string {
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(T.waSimple)}`;
}

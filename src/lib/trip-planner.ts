import type { Locale } from "@/i18n/routing";
import { FILLERS, HOPS, INTERESTS, PACES, REGIONS, ROUTE } from "./site-data";
import type { DraftState, Plan, PlanLeg } from "./types";

export const DEFAULT_DRAFT: DraftState = {
  step: 1,
  days: 10,
  interests: ["culture", "hills"],
  pace: "balanced",
  startDate: "",
  group: 2,
  note: "",
  excluded: [],
  included: [],
  dayOverride: {},
};

/** Site copy needed by the planner, as the flat "site" message namespace. */
export type SiteStrings = Record<string, string>;

/** "1 day" / "2 days", with Russian three-form plurals and unchanged Chinese. */
export function daysLabel(n: number, locale: Locale, T: SiteStrings): string {
  if (locale === "zh") return `${n} ${T.daysWord}`;
  if (locale === "ru") {
    const mod100 = n % 100;
    const mod10 = n % 10;
    if (mod10 === 1 && mod100 !== 11) return `${n} ${T.dayWord}`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return `${n} ${T.dayWordFew}`;
    }
    return `${n} ${T.daysWord}`;
  }
  return `${n} ${n === 1 ? T.dayWord : T.daysWord}`;
}

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
  const { excluded, dayOverride } = draft;
  const included = draft.included.filter((r) => !excluded.includes(r));

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
  included.forEach((r) => {
    if (!weights[r]) weights[r] = 1;
  });

  const shortTrip = draft.days <= 2 && !included.length;
  const cap = Math.max(shortTrip ? 1 : pace.maxRegions, included.length);
  const ranked = Object.keys(weights)
    .sort((a, b) => weights[b] - weights[a])
    .filter((r) => !excluded.includes(r))
    .slice(0, cap);
  included.forEach((r) => {
    if (!ranked.includes(r)) ranked.push(r);
  });

  const arrival = draft.days >= 4;
  const budget = draft.days - (arrival ? 1 : 0);
  const minPer = shortTrip ? 1 : pace.minDays;
  // Drop the lowest-ranked region that wasn't hand-picked until the rest fit.
  while (ranked.length > 1 && budget < ranked.length * minPer) {
    let idx = -1;
    for (let k = ranked.length - 1; k >= 0; k--) {
      if (!included.includes(ranked[k])) {
        idx = k;
        break;
      }
    }
    if (idx === -1) break;
    ranked.splice(idx, 1);
  }

  const order = ROUTE.filter((r) => ranked.includes(r));
  const freeOrder = order.filter((r) => dayOverride[r] === undefined);
  const overriddenSum = order.reduce(
    (a, r) => a + (dayOverride[r] !== undefined ? Math.max(1, dayOverride[r]) : 0),
    0,
  );
  const freeBudget = Math.max(freeOrder.length, budget - overriddenSum);
  const totalW = freeOrder.reduce((a, r) => a + weights[r], 0) || 1;
  const alloc: Record<string, number> = {};
  let used = 0;
  freeOrder.forEach((r, idx) => {
    let n = Math.max(minPer, Math.round((weights[r] / totalW) * freeBudget));
    if (idx === freeOrder.length - 1) n = Math.max(1, freeBudget - used);
    alloc[r] = n;
    used += n;
  });
  order.forEach((r) => {
    if (dayOverride[r] !== undefined) alloc[r] = Math.max(1, dayOverride[r]);
  });
  let over = used - freeBudget;
  let gi = freeOrder.length - 1;
  while (over > 0 && gi >= 0) {
    const r = freeOrder[gi];
    const take = Math.min(over, Math.max(0, alloc[r] - 1));
    alloc[r] -= take;
    over -= take;
    gi--;
  }

  // Never repeat a day: cap auto-allocated regions at their distinct entries
  // and spill the rest onto the regions that still have room.
  const capOf = (r: string) => REGIONS[r].days.length + (FILLERS[r]?.length ?? 0);
  let spill = 0;
  freeOrder.forEach((r) => {
    const max = capOf(r);
    if (alloc[r] > max) {
      spill += alloc[r] - max;
      alloc[r] = max;
    }
  });
  while (spill > 0) {
    const room = freeOrder.filter((r) => alloc[r] < capOf(r));
    if (!room.length) break;
    room.forEach((r) => {
      if (spill <= 0) return;
      alloc[r] += 1;
      spill -= 1;
    });
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
      tint: "var(--tint-colombo)",
      dot: "#9FB8C4",
      dayRange: dayRange(locale, T, 1, 1),
      days: [{ n: 1, tag: tag(1), title: T.arrTitle, place: T.arrPlace }],
      hop: first ? first[locale] : "",
      editable: false,
    });
    if (first) drive += first.h;
    dayNo = 2;
  }

  order.forEach((r, idx) => {
    const reg = REGIONS[r];
    const n = alloc[r];
    const templates = reg.days.concat(FILLERS[r] ?? []);
    const days = [];
    for (let i = 0; i < n; i++) {
      const tpl = templates[Math.min(i, templates.length - 1)][locale];
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
      tint: reg.tintVar,
      dot: reg.tint,
      dayRange: dayRange(locale, T, days[0].n, days[n - 1].n),
      days,
      hop: hopText,
      editable: true,
    });
  });

  if (order.length) {
    const last = order[order.length - 1];
    const back = HOPS[`${last}>colombo`] ?? HOPS[`colombo>${last}`];
    drive += back ? back.h : 3;
  }

  return { legs, order, drive: Math.round(drive), pace };
}

/** Total days actually laid out — differs from `draft.days` once legs are edited. */
export function planTotalDays(plan: Plan): number {
  return plan.legs.reduce((a, l) => a + l.days.length, 0);
}

export function planMessage(
  draft: DraftState,
  plan: Plan,
  locale: Locale,
  T: SiteStrings,
): string {
  const lines = plan.legs.map(
    (l) =>
      `${l.dayRange}: ${l.label} · ${l.days.map((d) => d.title).join("; ")}`,
  );
  const interestLabel = draft.interests.length
    ? INTERESTS.filter((i) => draft.interests.includes(i.id))
        .map((i) => i.label[locale])
        .join(", ")
    : T.waOpen;

  return [
    T.waHi,
    "",
    `${T.waLen}: ${daysLabel(planTotalDays(plan), locale, T)}`,
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

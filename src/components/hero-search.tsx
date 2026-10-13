"use client";

import { useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { scrollToPlanner, useDraft } from "@/components/draft-context";
import { INTERESTS } from "@/lib/site-data";
import { daysLabel, type SiteStrings } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

const MIX = "mix";
const MIX_INTERESTS = ["culture", "hills", "beaches"];

const FIELD = "flex-[1_1_200px] rounded-[14px] bg-field px-3.5 py-2.5";
const LABEL = "text-xs font-semibold text-ink/58";
const STEP_BTN =
  "h-11 w-11 cursor-pointer border-none bg-transparent text-xl text-ink";

/**
 * Quick-start bar under the hero: length, interest and group size. "Build my
 * itinerary" seeds the planner below with those answers and scrolls to it.
 */
export function HeroSearch() {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;
  const T = (useMessages() as unknown as { site: SiteStrings }).site;
  const { patch } = useDraft();

  const [days, setDays] = useState(7);
  const [interest, setInterest] = useState(MIX);
  const [group, setGroup] = useState(2);

  const mixLabel = t("waOpen");
  const options = [
    { id: MIX, label: mixLabel.charAt(0).toUpperCase() + mixLabel.slice(1) },
    ...INTERESTS.map((i) => ({ id: i.id, label: i.label[locale] })),
  ];

  const go = () => {
    patch({
      days,
      interests: interest === MIX ? MIX_INTERESTS.slice() : [interest],
      pace: "balanced",
      group,
      step: 4,
      excluded: [],
      included: [],
      dayOverride: {},
    });
    setTimeout(scrollToPlanner, 40);
  };

  return (
    <div
      role="search"
      className="flex flex-wrap gap-2 rounded-[20px] bg-surface p-2.5 shadow-[0_34px_70px_-30px_var(--shadow),0_0_0_1px_var(--line)]"
    >
      <div className={FIELD}>
        <p className={LABEL}>{t("mDays")}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setDays((d) => Math.max(1, d - 1))}
            aria-label={t("fewerDays")}
            className={`${STEP_BTN} -ml-2.5`}
          >
            −
          </button>
          <span className="text-xl font-bold" aria-live="polite">
            {daysLabel(days, locale, T)}
          </span>
          <button
            type="button"
            onClick={() => setDays((d) => Math.min(21, d + 1))}
            aria-label={t("moreDays")}
            className={`${STEP_BTN} -mr-2.5`}
          >
            +
          </button>
        </div>
      </div>

      <label className={`${FIELD} flex flex-col justify-center`}>
        <span className={LABEL}>{t("waInt")}</span>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="h-11 w-full cursor-pointer border-none bg-transparent p-0 text-[17px] font-bold outline-none"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className={FIELD}>
        <p className={LABEL}>{t("fGroup")}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setGroup((g) => Math.max(1, g - 1))}
            aria-label="−"
            className={`${STEP_BTN} -ml-2.5`}
          >
            −
          </button>
          <span className="text-xl font-bold" aria-live="polite">
            {group}
          </span>
          <button
            type="button"
            onClick={() => setGroup((g) => Math.min(16, g + 1))}
            aria-label="+"
            className={`${STEP_BTN} -mr-2.5`}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={go}
        className="min-h-[70px] flex-[1_1_200px] cursor-pointer rounded-[14px] border-none bg-accent px-5.5 text-base font-bold text-accent-ink transition-[filter] hover:brightness-110"
      >
        {t("hbGo")} →
      </button>
    </div>
  );
}

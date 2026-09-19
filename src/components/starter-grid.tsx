"use client";

import { useLocale, useMessages, useTranslations } from "next-intl";
import { scrollToPlanner, useDraft } from "@/components/draft-context";
import { STARTERS } from "@/lib/site-data";
import { daysLabel, type SiteStrings } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

/** One-tap starter trips: picking one fills the planner and jumps to it. */
export function StarterGrid() {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;
  const T = (useMessages() as unknown as { site: SiteStrings }).site;
  const { applyStarter } = useDraft();

  return (
    <div
      data-reveal
      className="mt-[clamp(30px,5vh,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-[clamp(14px,1.8vw,22px)]"
    >
      {STARTERS.map((st) => (
        <button
          key={st.id}
          type="button"
          onClick={() => {
            applyStarter(st);
            setTimeout(scrollToPlanner, 40);
          }}
          className="flex cursor-pointer flex-col items-start gap-2.5 rounded-[18px] border border-line bg-surface p-6 text-left text-ink transition-[transform,border-color] duration-400 ease-[cubic-bezier(.2,.8,.25,1)] hover:-translate-y-1.5 hover:border-terra"
        >
          <span className="text-[10px] tracking-[0.18em] text-terra uppercase">
            {daysLabel(st.days, locale, T)}
          </span>
          <span className="font-serif text-[26px] leading-[1.1]">
            {st.name[locale]}
          </span>
          <span className="text-sm leading-[1.55] text-ink/72">
            {st.blurb[locale]}
          </span>
          <span className="mt-auto pt-2.5 text-[13.5px] tracking-[0.04em] text-terra">
            {t("startersUse")}
          </span>
        </button>
      ))}
    </div>
  );
}

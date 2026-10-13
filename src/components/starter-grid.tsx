"use client";

import { useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { scrollToPlanner, useDraft } from "@/components/draft-context";
import { INTERESTS, PACES, STARTERS } from "@/lib/site-data";
import { daysLabel, type SiteStrings } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";
import type { Starter } from "@/lib/types";

const FACE =
  "col-start-1 row-start-1 flex flex-col rounded-[18px] p-6 backface-hidden";

const GRID =
  "mt-7.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4.5";

const paceOf = (st: Starter) => PACES.find((p) => p.id === st.pace) ?? PACES[1];

/**
 * One-tap starter trips. "flip" (home) shows the shape of the trip on the
 * front and its blurb plus a button on the back; cards flip on hover, keyboard
 * focus, and tap (touch screens have no hover). "list" (tours) shows
 * everything at once. Either way, the button fills the planner.
 */
export function StarterGrid({
  variant = "flip",
}: {
  variant?: "flip" | "list";
}) {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;
  const T = (useMessages() as unknown as { site: SiteStrings }).site;
  const { applyStarter } = useDraft();
  const [flipped, setFlipped] = useState<string | null>(null);

  const use = (st: Starter) => {
    applyStarter(st);
    setTimeout(scrollToPlanner, 40);
  };

  if (variant === "list") {
    return (
      <div className={GRID}>
        {STARTERS.map((st) => (
          <article
            key={st.id}
            className="flex flex-col gap-3 rounded-[18px] border border-line bg-surface p-6"
          >
            <div className="flex items-center justify-between gap-2.5">
              <span className="rounded-lg bg-accent-soft px-2.75 py-1.5 text-[13px] font-bold text-accent">
                {daysLabel(st.days, locale, T)}
              </span>
              <span className="text-[13px] font-semibold text-ink/58">
                {paceOf(st).label[locale]}
              </span>
            </div>
            <h3 className="text-[21px] leading-[1.2] font-extrabold tracking-[-0.02em]">
              {st.name[locale]}
            </h3>
            <p className="text-[15px] leading-[1.55] text-ink/72">
              {st.blurb[locale]}
            </p>
            <InterestTags ids={st.interests} locale={locale} outlined />
            <button
              type="button"
              onClick={() => use(st)}
              className="mt-auto min-h-12 cursor-pointer rounded-xl border-[1.5px] border-accent bg-transparent text-[15px] font-bold text-accent transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {t("startersUse")}
            </button>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className={GRID}>
      {STARTERS.map((st) => {
        const pace = paceOf(st);
        const isFlipped = flipped === st.id;
        return (
          <div key={st.id} className="min-h-[220px] perspective-[1200px] sm:min-h-[270px]">
            <article
              tabIndex={0}
              onFocus={() => setFlipped(st.id)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setFlipped(null);
              }}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                setFlipped(isFlipped ? null : st.id);
              }}
              className={`relative grid h-full min-h-[220px] cursor-pointer sm:min-h-[270px] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.25,1)] transform-3d outline-none hover:rotate-y-180 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg motion-reduce:transition-none ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              <div className={`${FACE} gap-3.5 border border-line bg-surface`}>
                <div className="flex items-center justify-between gap-2.5">
                  <span className="rounded-lg bg-accent-soft px-2.75 py-1.5 text-[13px] font-bold text-accent">
                    {daysLabel(st.days, locale, T)}
                  </span>
                  <span className="text-[13px] font-semibold text-ink/58">
                    {pace.label[locale]}
                  </span>
                </div>
                <h3 className="mt-auto text-2xl leading-[1.15] font-extrabold tracking-[-0.02em]">
                  {st.name[locale]}
                </h3>
                <span className="flex items-center gap-2 text-[13px] font-semibold text-ink/58">
                  <span className="block h-[1.5px] w-4.5 bg-ink/58" />
                  {t("startersFlip")}
                </span>
              </div>

              <div
                className={`${FACE} rotate-y-180 gap-3 border border-accent bg-accent-soft`}
              >
                <p className="text-[15px] leading-[1.55] text-ink">
                  {st.blurb[locale]}
                </p>
                <InterestTags ids={st.interests} locale={locale} />
                <button
                  type="button"
                  onClick={() => use(st)}
                  className="mt-auto min-h-12 cursor-pointer rounded-xl bg-accent text-[15px] font-bold text-accent-ink transition-opacity hover:opacity-88"
                >
                  {t("startersUse")}
                </button>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}

function InterestTags({
  ids,
  locale,
  outlined,
}: {
  ids: string[];
  locale: Locale;
  outlined?: boolean;
}) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {ids.map((id) => (
        <li
          key={id}
          className={`rounded-full px-2.5 py-1.25 text-[12.5px] font-semibold text-ink/72 ${
            outlined ? "border border-line-2" : "bg-surface"
          }`}
        >
          {INTERESTS.find((i) => i.id === id)?.label[locale]}
        </li>
      ))}
    </ul>
  );
}

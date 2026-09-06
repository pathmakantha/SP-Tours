"use client";

import { useTranslations } from "next-intl";
import { PlannerFields } from "@/components/planner-fields";
import { scrollToPlanner } from "@/lib/scroll";
import { usePlannerDraft } from "@/hooks/use-planner-draft";
import { STARTERS } from "@/lib/site-data";

export function StartersAndPlanner() {
  const t = useTranslations("site");
  const { draft, patch, toggleInterest, plan, waHref, locale, T } =
    usePlannerDraft();

  return (
    <>
      <section
        id="starters"
        aria-labelledby="starters-h"
        className="bg-bg px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] tracking-[0.26em] text-terra uppercase">
            {t("startersK")}
          </p>
          <h2
            id="starters-h"
            className="mt-4 max-w-[24ch] font-serif text-3xl leading-tight font-normal sm:text-5xl"
          >
            {t("startersH")}
          </h2>
          <p className="mt-3.5 max-w-[50ch] text-base leading-relaxed text-ink/72">
            {t("startersB")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STARTERS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  patch({
                    days: st.days,
                    interests: st.interests,
                    pace: st.pace,
                  });
                  setTimeout(scrollToPlanner, 40);
                }}
                className="flex flex-col items-start gap-2.5 rounded-2xl border border-line bg-surface p-6 text-left transition-transform hover:-translate-y-1.5 hover:border-terra"
              >
                <span className="font-mono text-[10px] tracking-[0.18em] text-terra uppercase">
                  {st.days} {t("startersDays")}
                </span>
                <span className="font-serif text-[26px] leading-tight">
                  {st.name[locale]}
                </span>
                <span className="text-sm leading-snug text-ink/72">
                  {st.blurb[locale]}
                </span>
                <span className="mt-auto pt-2.5 text-[13.5px] tracking-[0.04em] text-terra">
                  {t("startersUse")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="planner"
        className="bg-gradient-to-b from-bg to-bg-alt px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.26em] text-terra uppercase">
                {t("plKicker")}
              </p>
              <h2 className="mt-4.5 max-w-[22ch] font-serif text-4xl leading-none font-normal tracking-tight sm:text-6xl">
                {t("plH")}
              </h2>
            </div>
            <p className="max-w-[38ch] text-base leading-relaxed text-ink/72">
              {t("plBody")}
            </p>
          </div>
          <div className="mt-10">
            <PlannerFields
              draft={draft}
              patch={patch}
              toggleInterest={toggleInterest}
              locale={locale}
              t={T}
              plan={plan}
              waHref={waHref}
            />
          </div>
        </div>
      </section>
    </>
  );
}

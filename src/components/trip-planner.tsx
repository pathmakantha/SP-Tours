"use client";

import { useLocale, useMessages, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useDraft } from "@/components/draft-context";
import { PlannerFields } from "@/components/planner-fields";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { buildPlan, planHref, type SiteStrings } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

/**
 * Full "planner" section (kicker/heading/lede + wizard) backed by the
 * cross-page DraftContext — used on the About, Tours and Destination pages.
 */
export function TripPlanner({
  kicker,
  heading,
  lede,
}: {
  kicker?: string;
  heading?: string;
  lede?: string;
} = {}) {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;
  const messages = useMessages() as unknown as { site: SiteStrings };
  const T = messages.site;
  const { draft, patch, toggleInterest } = useDraft();

  const plan = useMemo(() => buildPlan(draft, locale, T), [draft, locale, T]);
  const waHref = planHref(WHATSAPP_NUMBER, draft, plan, locale, T);

  return (
    <section
      id="planner"
      className="bg-gradient-to-b from-bg to-bg-alt px-4 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.26em] text-terra uppercase">
              {kicker ?? t("plKicker")}
            </p>
            <h2 className="mt-4.5 max-w-[22ch] font-serif text-4xl leading-none font-normal tracking-tight sm:text-6xl">
              {heading ?? t("plH")}
            </h2>
          </div>
          <p className="max-w-[38ch] text-base leading-relaxed text-ink/72">
            {lede ?? t("plBody")}
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
  );
}

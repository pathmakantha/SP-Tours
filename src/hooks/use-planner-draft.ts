"use client";

import { useLocale, useMessages } from "next-intl";
import { useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { buildPlan, planHref, type SiteStrings } from "@/lib/trip-planner";
import type { DraftState } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

/**
 * Local (non-shared) trip planner state — every embed of the planner
 * manages its own draft rather than syncing across pages.
 */
export function usePlannerDraft(presetInterest?: string) {
  const locale = useLocale() as Locale;
  const messages = useMessages() as unknown as { site: SiteStrings };
  const T = messages.site;

  const [draft, setDraft] = useState<DraftState>({
    step: 1,
    days: 10,
    interests: presetInterest ? [presetInterest] : ["culture", "hills"],
    pace: "balanced",
    startDate: "",
    group: 2,
    note: "",
  });

  const patch = (p: Partial<DraftState>) =>
    setDraft((prev) => ({ ...prev, ...p }));

  const toggleInterest = (id: string) =>
    setDraft((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((x) => x !== id)
        : [...prev.interests, id],
    }));

  const plan = useMemo(() => buildPlan(draft, locale, T), [draft, locale, T]);
  const waHref = planHref(WHATSAPP_NUMBER, draft, plan, locale, T);

  return { draft, patch, toggleInterest, plan, waHref, locale, T };
}

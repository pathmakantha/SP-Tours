"use client";

import { PlannerFields } from "@/components/planner-fields";
import { usePlannerDraft } from "@/hooks/use-planner-draft";

export function LocalPlanner({
  presetInterest,
}: {
  presetInterest?: string;
} = {}) {
  const { draft, patch, toggleInterest, plan, waHref, locale, T } =
    usePlannerDraft(presetInterest);

  return (
    <PlannerFields
      draft={draft}
      patch={patch}
      toggleInterest={toggleInterest}
      locale={locale}
      t={T}
      plan={plan}
      waHref={waHref}
    />
  );
}

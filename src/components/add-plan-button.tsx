"use client";

import { useDraft, scrollToPlanner } from "@/components/draft-context";

export function AddPlanButton({
  interestId,
  label,
  className,
}: {
  interestId: string;
  label: string;
  className?: string;
}) {
  const { addInterest } = useDraft();

  return (
    <button
      type="button"
      onClick={() => {
        addInterest(interestId);
        setTimeout(scrollToPlanner, 40);
      }}
      className={className}
    >
      {label}
    </button>
  );
}

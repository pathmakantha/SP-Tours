"use client";

import { useEffect } from "react";
import { useDraft } from "@/components/draft-context";

export function SeedInterest({ interestId }: { interestId: string }) {
  const { addInterest } = useDraft();

  useEffect(() => {
    addInterest(interestId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interestId]);

  return null;
}

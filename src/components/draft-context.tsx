"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_DRAFT } from "@/lib/trip-planner";
import type { DraftState } from "@/lib/types";

const STORAGE_KEY = "sptours.draft";

interface DraftContextValue {
  draft: DraftState;
  patch: (patch: Partial<DraftState>) => void;
  addInterest: (id: string, silent?: boolean) => void;
  toggleInterest: (id: string) => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

function loadInitialDraft(): DraftState {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DRAFT,
      ...parsed,
      step: 1,
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<DraftState>(DEFAULT_DRAFT);

  useEffect(() => {
    // One-time sync from localStorage after mount: the initial state must
    // match the server-rendered default to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loadInitialDraft());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          days: draft.days,
          interests: draft.interests,
          pace: draft.pace,
          startDate: draft.startDate,
          group: draft.group,
          note: draft.note,
        }),
      );
    } catch {
      // ignore
    }
  }, [draft]);

  const patch = useCallback((p: Partial<DraftState>) => {
    setDraft((prev) => ({ ...prev, ...p }));
  }, []);

  const addInterest = useCallback((id: string, silent?: boolean) => {
    setDraft((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests
        : [...prev.interests, id],
      step: silent ? prev.step : 2,
    }));
  }, []);

  const toggleInterest = useCallback((id: string) => {
    setDraft((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((x) => x !== id)
        : [...prev.interests, id],
    }));
  }, []);

  const value = useMemo(
    () => ({ draft, patch, addInterest, toggleInterest }),
    [draft, patch, addInterest, toggleInterest],
  );

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used within DraftProvider");
  return ctx;
}

export function scrollToPlanner() {
  const el = document.getElementById("planner");
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 66,
    behavior: "smooth",
  });
}

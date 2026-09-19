"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { INTERESTS, PACES } from "@/lib/site-data";
import { DEFAULT_DRAFT } from "@/lib/trip-planner";
import type { DraftState, Starter } from "@/lib/types";

const STORAGE_KEY = "sptours.draft";

interface DraftContextValue {
  draft: DraftState;
  patch: (patch: Partial<DraftState>) => void;
  /** Like `patch`, but derives the change from the live state (safe for rapid taps). */
  update: (fn: (prev: DraftState) => Partial<DraftState>) => void;
  addInterest: (id: string, silent?: boolean) => void;
  toggleInterest: (id: string) => void;
  applyStarter: (starter: Starter) => void;
}

const DraftContext = createContext<DraftContextValue | null>(null);

const NOTE_MAX = 500;

const clampInt = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === "number" && Number.isFinite(v)
    ? Math.min(max, Math.max(min, Math.round(v)))
    : fallback;

/**
 * Stored drafts are untrusted (edited by hand, left by an older version, or
 * corrupted), so only known fields with the right types and ranges are kept.
 */
function loadInitialDraft(): DraftState {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DRAFT;
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== "object") return DEFAULT_DRAFT;
    const d = p as Record<string, unknown>;
    return {
      ...DEFAULT_DRAFT,
      days: clampInt(d.days, 1, 21, DEFAULT_DRAFT.days),
      group: clampInt(d.group, 1, 16, DEFAULT_DRAFT.group),
      interests: Array.isArray(d.interests)
        ? d.interests.filter(
            (id): id is string =>
              typeof id === "string" && INTERESTS.some((i) => i.id === id),
          )
        : DEFAULT_DRAFT.interests,
      pace:
        typeof d.pace === "string" && PACES.some((x) => x.id === d.pace)
          ? d.pace
          : DEFAULT_DRAFT.pace,
      startDate:
        typeof d.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.startDate)
          ? d.startDate
          : "",
      note: typeof d.note === "string" ? d.note.slice(0, NOTE_MAX) : "",
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

  const update = useCallback(
    (fn: (prev: DraftState) => Partial<DraftState>) => {
      setDraft((prev) => ({ ...prev, ...fn(prev) }));
    },
    [],
  );

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

  const applyStarter = useCallback((st: Starter) => {
    setDraft((prev) => ({
      ...prev,
      days: st.days,
      interests: st.interests.slice(),
      pace: st.pace,
      step: 4,
      excluded: [],
      included: [],
      dayOverride: {},
    }));
  }, []);

  const value = useMemo(
    () => ({ draft, patch, update, addInterest, toggleInterest, applyStarter }),
    [draft, patch, update, addInterest, toggleInterest, applyStarter],
  );

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

export { NOTE_MAX };

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

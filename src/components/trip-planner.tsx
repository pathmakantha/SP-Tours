"use client";

import { useLocale, useMessages, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useDraft } from "@/components/draft-context";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { INTERESTS, PACES, REGIONS, ROUTE } from "@/lib/site-data";
import {
  buildPlan,
  daysLabel,
  planHref,
  planTotalDays,
  type SiteStrings,
} from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function chipClasses(on: boolean) {
  return on
    ? "border-ink bg-ink text-bg"
    : "border-line-2 bg-field text-ink hover:border-ink/40";
}

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
  const { draft, patch, update, toggleInterest } = useDraft();

  const plan = useMemo(() => buildPlan(draft, locale, T), [draft, locale, T]);
  const mounted = useMounted();
  const asideRef = useRef<HTMLElement>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(false), 1800);
    return () => clearTimeout(id);
  }, [flash]);

  /** Last step's button: bring the finished itinerary into view and highlight it. */
  const reviewPlan = () => {
    const el = asideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 64 || r.bottom > window.innerHeight) {
      window.scrollTo({ top: r.top + window.scrollY - 76, behavior: "smooth" });
    }
    el.focus({ preventScroll: true });
    setFlash(true);
  };

  const totalDays = planTotalDays(plan);
  const waHref = planHref(
    WHATSAPP_NUMBER,
    { ...draft, days: totalDays },
    plan,
    locale,
    T,
  );

  const lengthOptions = [
    [5, t("len1")],
    [7, t("len2")],
    [10, t("len3")],
    [14, t("len4")],
  ] as const;

  const sliderLabel = daysLabel(draft.days, locale, T);
  const stepLabel =
    locale === "zh" ? `第 ${draft.step} / 4 步` : `${t("stepWord")} ${draft.step}/4`;

  const stepLegDays = (key: string, delta: number, current: number) =>
    update((prev) => {
      const cur = prev.dayOverride[key] ?? current;
      const next = Math.min(14, Math.max(1, cur + delta));
      if (next === cur) return {};
      return { dayOverride: { ...prev.dayOverride, [key]: next } };
    });

  const removeLeg = (key: string) =>
    update((prev) => {
      const dayOverride = { ...prev.dayOverride };
      delete dayOverride[key];
      return {
        excluded: prev.excluded.includes(key)
          ? prev.excluded
          : [...prev.excluded, key],
        included: prev.included.filter((x) => x !== key),
        dayOverride,
      };
    });

  const addLeg = (key: string) =>
    update((prev) => ({
      excluded: prev.excluded.filter((x) => x !== key),
      included: prev.included.includes(key)
        ? prev.included
        : [...prev.included, key],
    }));

  const addable = ROUTE.filter((r) => !plan.order.includes(r));

  const regionNames = plan.order.map((r) => REGIONS[r].label[locale]);
  const planHeading = regionNames.length
    ? regionNames.slice(0, 2).join(" + ") +
      (regionNames.length > 2
        ? ` + ${regionNames.length - 2} ${t("regionsMore")}`
        : "")
    : t("country");

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

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-2 lg:gap-9">
          {/* Wizard card */}
          <div className="rounded-3xl border border-line bg-surface p-5 shadow-[0_40px_80px_-50px_var(--color-shadow)] sm:p-8">
            <div className="flex items-center gap-3.5">
              <span className="flex-none font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                {stepLabel}
              </span>
              <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full bg-terra transition-[width] duration-500"
                  style={{ width: `${(draft.step / 4) * 100}%` }}
                />
              </span>
            </div>

            {draft.step === 1 && (
              <div>
                <h3 className="mt-5 font-serif text-[26px] leading-tight font-normal sm:text-[32px]">
                  {t("q1")}
                </h3>
                <p className="mt-2.5 text-[15px] text-ink/72">{t("q1h")}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {lengthOptions.map(([days, label]) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => patch({ days })}
                      className={`flex flex-col gap-1.5 rounded-2xl border px-4.5 py-5 text-left transition-all ${chipClasses(
                        draft.days === days,
                      )}`}
                    >
                      <span className="font-serif text-3xl leading-none">
                        {days}
                      </span>
                      <span className="text-[12px] tracking-[0.08em] uppercase opacity-72">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <label className="mt-7 block">
                  <span className="flex justify-between text-[13px] tracking-[0.06em] text-ink/72">
                    <span>{t("fineTune")}</span>
                    <span>{sliderLabel}</span>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={21}
                    step={1}
                    value={draft.days}
                    onChange={(e) => patch({ days: parseInt(e.target.value, 10) })}
                    className="mt-3 w-full accent-terra"
                  />
                </label>
              </div>
            )}

            {draft.step === 2 && (
              <div>
                <h3 className="mt-5 font-serif text-[26px] leading-tight font-normal sm:text-[32px]">
                  {t("q2")}
                </h3>
                <p className="mt-2.5 text-[15px] text-ink/72">{t("q2h")}</p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {INTERESTS.map((i) => {
                    const on = draft.interests.includes(i.id);
                    return (
                      <button
                        key={i.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleInterest(i.id)}
                        className={`flex flex-col gap-1.5 rounded-2xl border px-4.5 py-4.5 text-left transition-all ${chipClasses(
                          on,
                        )}`}
                      >
                        <span className="text-base font-medium">
                          {i.label[locale]}
                        </span>
                        <span className="text-[13px] leading-snug opacity-68">
                          {i.blurb[locale]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {draft.step === 3 && (
              <div>
                <h3 className="mt-5 font-serif text-[26px] leading-tight font-normal sm:text-[32px]">
                  {t("q3")}
                </h3>
                <p className="mt-2.5 text-[15px] text-ink/72">{t("q3h")}</p>
                <div className="mt-6 grid gap-3">
                  {PACES.map((p) => {
                    const on = draft.pace === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => patch({ pace: p.id })}
                        className={`flex items-center gap-4.5 rounded-2xl border px-5 py-4.5 text-left transition-all ${chipClasses(
                          on,
                        )}`}
                      >
                        <span className="min-w-[2.5ch] flex-none font-serif text-2xl">
                          {p.mark}
                        </span>
                        <span>
                          <span className="block text-base font-medium">
                            {p.label[locale]}
                          </span>
                          <span className="mt-0.5 block text-[13px] opacity-68">
                            {p.blurb[locale]}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {draft.step === 4 && (
              <div>
                <h3 className="mt-5 font-serif text-[26px] leading-tight font-normal sm:text-[32px]">
                  {t("q4")}
                </h3>
                <p className="mt-2.5 text-[15px] text-ink/72">{t("q4h")}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <label className="flex flex-col gap-2 text-[13px] tracking-[0.06em] text-ink/72">
                    {t("fDate")}
                    <input
                      type="date"
                      value={draft.startDate}
                      onChange={(e) => patch({ startDate: e.target.value })}
                      className="rounded-xl border border-line-2 bg-field px-3.5 py-3.5 text-[15px]"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-[13px] tracking-[0.06em] text-ink/72">
                    {t("fGroup")}
                    <span className="flex items-center gap-2.5">
                      <button
                        type="button"
                        aria-label="-"
                        onClick={() =>
                          patch({ group: Math.max(1, draft.group - 1) })
                        }
                        className="h-[46px] w-[46px] flex-none rounded-xl border border-line-2 bg-field text-xl hover:bg-ink hover:text-bg"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-serif text-2xl">
                        {draft.group}
                      </span>
                      <button
                        type="button"
                        aria-label="+"
                        onClick={() => patch({ group: Math.min(16, draft.group + 1) })}
                        className="h-[46px] w-[46px] flex-none rounded-xl border border-line-2 bg-field text-xl hover:bg-ink hover:text-bg"
                      >
                        +
                      </button>
                    </span>
                  </label>
                  <label className="flex flex-col gap-2 text-[13px] tracking-[0.06em] text-ink/72">
                    {t("fNote")}
                    <input
                      type="text"
                      value={draft.note}
                      onChange={(e) => patch({ note: e.target.value })}
                      placeholder={t("fNotePh")}
                      className="rounded-xl border border-line-2 bg-field px-3.5 py-3.5 text-[15px]"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3.5 border-t border-line pt-5.5">
              <button
                type="button"
                onClick={() => patch({ step: Math.max(1, draft.step - 1) as 1 | 2 | 3 | 4 })}
                className="rounded-full border border-line-2 px-5.5 py-3 text-sm transition-colors hover:border-ink disabled:opacity-35"
                disabled={draft.step === 1}
              >
                {t("back")}
              </button>
              <button
                type="button"
                onClick={() =>
                  draft.step === 4
                    ? reviewPlan()
                    : patch({ step: (draft.step + 1) as 1 | 2 | 3 | 4 })
                }
                className="rounded-full bg-deep2 px-6.5 py-3.5 text-sm font-medium tracking-[0.03em] text-od transition-colors hover:bg-terra"
              >
                {draft.step === 4 ? t("nextEnd") : t("nextGo")}
              </button>
            </div>
          </div>

          {/* Draft itinerary aside */}
          <aside
            ref={asideRef}
            tabIndex={-1}
            aria-live="polite"
            className={`sticky top-20 rounded-3xl bg-deep p-5 text-od shadow-[0_50px_90px_-50px_var(--color-shadow)] outline-none transition-shadow duration-500 sm:p-8 ${
              flash ? "ring-2 ring-gold" : "ring-0 ring-transparent"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] tracking-[0.22em] text-gold-t uppercase">
                {t("draftLabel")}
              </p>
              <p className="text-xs text-od/50">{t("live")}</p>
            </div>
            <h3 className="mt-3.5 font-serif text-2xl leading-tight font-normal sm:text-[34px]">
              {planHeading}
            </h3>
            <dl className="mt-5 flex flex-wrap gap-5 border-t border-b border-od/14 py-4">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
                  {t("mDays")}
                </dt>
                <dd className="mt-1 text-lg">{totalDays}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
                  {t("mRegions")}
                </dt>
                <dd className="mt-1 text-lg">{plan.order.length}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
                  {t("mDrive")}
                </dt>
                <dd className="mt-1 text-lg">
                  ≈{plan.drive}
                  {t("hourSuffix")}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
                  {t("mPace")}
                </dt>
                <dd className="mt-1 text-lg">{plan.pace.label[locale]}</dd>
              </div>
            </dl>

            <ol className="mt-5.5 max-h-[52vh] list-none overflow-y-auto p-0">
              {plan.legs.map((leg) => (
                <li
                  key={leg.key}
                  className="relative border-l border-od/22 py-0 pb-5.5 pl-6.5"
                >
                  <span
                    className="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full"
                    style={{ background: leg.dot }}
                  />
                  <div className="flex items-center justify-between gap-2.5">
                    <p
                      className="font-mono text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: leg.tint }}
                    >
                      {leg.dayRange} · {leg.label}
                    </p>
                    {leg.editable && (
                      <span className="-my-2.5 flex flex-none items-center gap-0.5">
                        <LegButton
                          label={t("fewerDays")}
                          glyph="−"
                          dimmed={leg.days.length <= 1}
                          onClick={() => stepLegDays(leg.key, -1, leg.days.length)}
                        />
                        <LegButton
                          label={t("moreDays")}
                          glyph="+"
                          onClick={() => stepLegDays(leg.key, 1, leg.days.length)}
                        />
                        <LegButton
                          label={t("removePlace")}
                          glyph="✕"
                          onClick={() => removeLeg(leg.key)}
                        />
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 flex flex-col gap-2">
                    {leg.days.map((d) => (
                      <div
                        key={d.n}
                        className="flex gap-3 rounded-xl bg-od/[0.06] px-3.5 py-3 transition-colors hover:bg-od/14"
                      >
                        <span className="flex-none pt-0.5 font-mono text-[10px] text-od/42">
                          {d.tag}
                        </span>
                        <span>
                          <span className="block text-[15px] leading-snug">
                            {d.title}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] text-od/50">
                            {d.place}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2.5 text-xs text-od/42">{leg.hop}</p>
                </li>
              ))}
            </ol>

            {addable.length > 0 && (
              <div className="mt-1.5 border-t border-od/14 pt-4">
                <p className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
                  {t("addPlaceLabel")}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {addable.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => addLeg(r)}
                      className="flex min-h-11 items-center rounded-full border border-od/22 px-4.5 text-[13.5px] whitespace-nowrap text-od transition-colors hover:border-gold hover:bg-od/[0.06]"
                    >
                      + {REGIONS[r].label[locale]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-green py-4.5 text-center text-[15px] font-medium text-green-ink shadow-[0_20px_40px_-20px_color-mix(in_oklab,var(--green)_60%,transparent)] hover:bg-gold"
            >
              {t("sendPlan")}
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-od/22 py-3.5 text-[14.5px] font-medium text-od transition-colors hover:border-terra hover:bg-od/[0.06]"
            >
              {t("downloadPdf")}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-od/42">
              {t("sendNote")}
            </p>
          </aside>
        </div>
      </div>

      {/* Printed by "Download plan as PDF". Rendered straight under <body> so the
          print stylesheet can drop everything else and avoid blank pages. */}
      {mounted &&
        createPortal(
      <div data-print-sheet>
        <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: "#8A5E12" }}>
          SP Tours · {t("draftLabel")}
        </p>
        <h1 className="mt-2 font-serif text-[26px] leading-tight font-normal">
          {planHeading}
        </h1>
        <table className="mt-3.5 w-full border-collapse border-y border-[#10312F] text-[11px]">
          <tbody>
            <tr>
              <td className="py-2 pr-2.5">
                <strong>{t("mDays")}:</strong> {totalDays}
              </td>
              <td className="px-2.5 py-2">
                <strong>{t("mRegions")}:</strong> {plan.order.length}
              </td>
              <td className="px-2.5 py-2">
                <strong>{t("mDrive")}:</strong> ≈{plan.drive}
                {t("hourSuffix")}
              </td>
              <td className="py-2 pl-2.5">
                <strong>{t("mPace")}:</strong> {plan.pace.label[locale]}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4">
          {plan.legs.map((leg) => (
            <div key={leg.key} className="mb-3.5 break-inside-avoid">
              <p className="text-[9px] tracking-[0.16em] uppercase" style={{ color: "#8A5E12" }}>
                {leg.dayRange} · {leg.label}
              </p>
              {leg.days.map((d) => (
                <p key={d.n} className="mt-1 text-xs leading-normal">
                  <strong>{d.tag}</strong> · {d.title}{" "}
                  <span style={{ color: "#5A6B68" }}>({d.place})</span>
                </p>
              ))}
              <p className="mt-1 text-[10.5px]" style={{ color: "#5A6B68" }}>
                {leg.hop}
              </p>
            </div>
          ))}
        </div>
      </div>,
          document.body,
        )}
    </section>
  );
}

/** 44×44 tap target wrapping a 24px visual circle, per the design's a11y pass. */
function LegButton({
  label,
  glyph,
  dimmed,
  onClick,
}: {
  label: string;
  glyph: string;
  dimmed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={dimmed || undefined}
      onClick={onClick}
      className={`flex h-11 w-11 flex-none items-center justify-center text-[15px] leading-none text-od ${
        dimmed ? "opacity-35" : ""
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-od/22 transition-colors hover:border-terra">
        {glyph}
      </span>
    </button>
  );
}

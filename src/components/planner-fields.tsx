"use client";

import { INTERESTS, PACES, REGIONS } from "@/lib/site-data";
import type { SiteStrings } from "@/lib/trip-planner";
import type { DraftState, Plan } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

function chipClasses(on: boolean) {
  return on
    ? "border-ink bg-ink text-bg"
    : "border-line-2 bg-field text-ink hover:border-ink/40";
}

export function PlannerFields({
  draft,
  patch,
  toggleInterest,
  locale,
  t,
  plan,
  waHref,
}: {
  draft: DraftState;
  patch: (patch: Partial<DraftState>) => void;
  toggleInterest: (id: string) => void;
  locale: Locale;
  t: SiteStrings;
  plan: Plan;
  waHref: string;
}) {
  const lengthOptions = [
    [5, t.len1],
    [7, t.len2],
    [10, t.len3],
    [14, t.len4],
  ] as const;

  const daysLabel = locale === "zh" ? `${draft.days} 天` : `${draft.days} ${t.daysWord}`;
  const stepLabel =
    locale === "zh" ? `第 ${draft.step} / 4 步` : `${t.stepWord} ${draft.step}/4`;

  const regionNames = plan.order.map((r) => REGIONS[r].label[locale]);
  const planHeading = regionNames.length
    ? regionNames.slice(0, 2).join(" + ") +
      (regionNames.length > 2
        ? ` + ${regionNames.length - 2} ${t.regionsMore}`
        : "")
    : t.country;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-9">
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
              {t.q1}
            </h3>
            <p className="mt-2.5 text-[15px] text-ink/72">{t.q1h}</p>
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
                  <span className="font-serif text-3xl leading-none">{days}</span>
                  <span className="text-[12px] tracking-[0.08em] uppercase opacity-72">
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <label className="mt-7 block">
              <span className="flex justify-between text-[13px] tracking-[0.06em] text-ink/72">
                <span>{t.fineTune}</span>
                <span>{daysLabel}</span>
              </span>
              <input
                type="range"
                min={3}
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
              {t.q2}
            </h3>
            <p className="mt-2.5 text-[15px] text-ink/72">{t.q2h}</p>
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
                    <span className="text-base font-medium">{i.label[locale]}</span>
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
              {t.q3}
            </h3>
            <p className="mt-2.5 text-[15px] text-ink/72">{t.q3h}</p>
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
              {t.q4}
            </h3>
            <p className="mt-2.5 text-[15px] text-ink/72">{t.q4h}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-2 text-[13px] tracking-[0.06em] text-ink/72">
                {t.fDate}
                <input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => patch({ startDate: e.target.value })}
                  className="rounded-xl border border-line-2 bg-field px-3.5 py-3.5 text-[15px]"
                />
              </label>
              <label className="flex flex-col gap-2 text-[13px] tracking-[0.06em] text-ink/72">
                {t.fGroup}
                <span className="flex items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="-"
                    onClick={() => patch({ group: Math.max(1, draft.group - 1) })}
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
                {t.fNote}
                <input
                  type="text"
                  value={draft.note}
                  onChange={(e) => patch({ note: e.target.value })}
                  placeholder={t.fNotePh}
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
            {t.back}
          </button>
          <button
            type="button"
            onClick={() => patch({ step: Math.min(4, draft.step + 1) as 1 | 2 | 3 | 4 })}
            className="rounded-full bg-deep2 px-6.5 py-3.5 text-sm font-medium tracking-[0.03em] text-od transition-colors hover:bg-terra"
          >
            {draft.step === 4 ? t.nextEnd : t.nextGo}
          </button>
        </div>
      </div>

      {/* Draft itinerary aside */}
      <aside
        aria-live="polite"
        className="sticky top-20 rounded-3xl bg-deep p-5 text-od shadow-[0_50px_90px_-50px_var(--color-shadow)] sm:p-8"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.22em] text-gold uppercase">
            {t.draftLabel}
          </p>
          <p className="text-xs text-od/50">{t.live}</p>
        </div>
        <h3 className="mt-3.5 font-serif text-2xl leading-tight font-normal sm:text-[34px]">
          {planHeading}
        </h3>
        <dl className="mt-5 flex flex-wrap gap-5 border-t border-b border-od/14 py-4">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
              {t.mDays}
            </dt>
            <dd className="mt-1 text-lg">{draft.days}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
              {t.mRegions}
            </dt>
            <dd className="mt-1 text-lg">{plan.order.length}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
              {t.mDrive}
            </dt>
            <dd className="mt-1 text-lg">
              ≈{plan.drive}
              {t.hourSuffix}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-od/50 uppercase">
              {t.mPace}
            </dt>
            <dd className="mt-1 text-lg">{plan.pace.label[locale]}</dd>
          </div>
        </dl>

        <ol className="mt-5.5 max-h-[52vh] list-none overflow-y-auto p-0">
          {plan.legs.map((leg) => (
            <li key={leg.key} className="relative border-l border-od/22 py-0 pb-5.5 pl-6.5">
              <span
                className="absolute top-1 -left-[5px] h-2.5 w-2.5 rounded-full"
                style={{ background: leg.tint }}
              />
              <p
                className="font-mono text-[9px] tracking-[0.2em] uppercase"
                style={{ color: leg.tint }}
              >
                {leg.dayRange} — {leg.label}
              </p>
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
                      <span className="block text-[15px] leading-snug">{d.title}</span>
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

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="mt-6 flex items-center justify-center gap-2.5 rounded-2xl bg-green py-4.5 text-center text-[15px] font-medium text-green-ink shadow-[0_20px_40px_-20px_rgba(95,169,127,0.6)] hover:bg-gold"
        >
          {t.sendPlan}
        </a>
        <p className="mt-3 text-xs leading-relaxed text-od/42">{t.sendNote}</p>
      </aside>
    </div>
  );
}

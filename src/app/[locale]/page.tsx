import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { PlaceholderImage } from "@/components/placeholder-image";
import { AddPlanButton } from "@/components/add-plan-button";
import { TripPlanner } from "@/components/trip-planner";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

const REGION_ROWS = [
  {
    key: "cultural",
    dest: "sigiriya",
    kicker: "w1k",
    title: "w1t",
    titleItalic: "w1t2",
    body: "w1b",
    chips: ["w1c1", "w1c2", "w1c3"],
    interest: "culture",
    photo: "reg-cultural",
  },
  {
    key: "hill",
    dest: "ella",
    kicker: "w2k",
    title: "w2t",
    titleItalic: "w2t2",
    body: "w2b",
    chips: ["w2c1", "w2c2", "w2c3"],
    interest: "hills",
    photo: "reg-hill",
  },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <>
      <SiteHeader />
      <main id="top" className="pt-[62px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-deep px-4 py-20 text-od sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-[760px]">
              <p className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] text-gold uppercase">
                <span className="block h-px w-11 flex-none bg-gold" />
                {t("heroKicker")}
              </p>
              <h1 className="font-serif text-5xl leading-[0.96] font-normal tracking-tight sm:text-7xl lg:text-8xl">
                {t("heroL1")} <span className="text-gold italic">{t("heroL2")}</span>
                {t("heroL3")}
              </h1>
              <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-od/72 sm:text-lg">
                {t("heroBody")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href="#planner"
                  className="rounded-full bg-gold px-7 py-4 text-[15px] font-medium text-[#061C1D] shadow-[0_18px_40px_-18px_rgba(199,154,75,0.7)] hover:bg-od"
                >
                  {t("ctaStart")}
                </a>
                <a
                  href={waSimple}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 rounded-full border border-od/22 px-7 py-4 text-[15px] text-od hover:border-gold hover:bg-gold/12"
                >
                  <span className="h-2 w-2 flex-none rounded-full bg-green" />
                  {t("ctaWa")}
                </a>
              </div>
              <dl className="mt-10 flex flex-wrap gap-8 border-t border-od/14 pt-6 sm:gap-14">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-od/50 uppercase">
                    {t("stat1k")}
                  </dt>
                  <dd className="mt-1.5 font-serif text-[34px]">1,200+</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-od/50 uppercase">
                    {t("stat2k")}
                  </dt>
                  <dd className="mt-1.5 font-serif text-[34px]">{t("stat2v")}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-od/50 uppercase">
                    {t("stat3k")}
                  </dt>
                  <dd className="mt-1.5 font-serif text-[34px]">14</dd>
                </div>
              </dl>
            </div>

            <div className="relative h-[340px] sm:h-[420px] lg:h-[500px]">
              <div className="absolute top-[2%] left-[6%] h-[74%] w-[58%] overflow-hidden rounded-2xl border border-od/14 shadow-2xl">
                <PlaceholderImage label="Sigiriya rock at sunrise" />
              </div>
              <div className="absolute top-[18%] right-[2%] h-[52%] w-[42%] overflow-hidden rounded-2xl border border-od/14 shadow-2xl">
                <PlaceholderImage label="Tea picker, hill country" />
              </div>
              <div className="absolute bottom-[6%] left-[24%] hidden h-[240px] w-[220px] max-w-[38%] overflow-hidden rounded-2xl border border-od/22 shadow-2xl sm:block">
                <PlaceholderImage label="Leopard, Yala" />
              </div>
              <div className="absolute right-[4%] bottom-0 rounded-2xl bg-surface px-4.5 py-3.5 text-ink shadow-2xl">
                <p className="font-mono text-[9px] tracking-[0.2em] text-terra uppercase">
                  {t("draftLabel")}
                </p>
                <p className="mt-1 font-serif text-xl leading-tight">
                  10 {t("daysWord")} · 2 {t("regionsWord")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why us */}
        <section id="why" className="bg-bg px-4 py-16 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-end gap-8 sm:grid-cols-2">
              <h2 className="max-w-[18ch] font-serif text-4xl leading-none font-normal tracking-tight sm:text-6xl">
                {t("whyL1")} <span className="text-terra italic">{t("whyL2")}</span>
                {t("whyL3")}
              </h2>
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink/72">
                {t("whyBody")}
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {(
                [
                  ["why1k", "why1t", "why1b", false],
                  ["why2k", "why2t", "why2b", true],
                  ["why3k", "why3t", "why3b", false],
                  ["why4k", "why4t", "why4b", false],
                ] as const
              ).map(([k, ti, b, dark]) => (
                <article
                  key={k}
                  className={`flex flex-col gap-3.5 rounded-[20px] p-7 transition-transform hover:-translate-y-1.5 ${
                    dark
                      ? "bg-deep2 text-od"
                      : "border border-line bg-surface"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.22em] ${
                      dark ? "text-gold" : "text-terra"
                    }`}
                  >
                    {t(k)}
                  </span>
                  <h3 className="font-serif text-[26px] leading-tight font-normal">
                    {t(ti)}
                  </h3>
                  <p
                    className={`text-[15px] leading-relaxed ${
                      dark ? "text-od/72" : "text-ink/72"
                    }`}
                  >
                    {t(b)}
                  </p>
                </article>
              ))}
              <figure className="relative min-h-[280px] overflow-hidden rounded-[22px] sm:col-span-2">
                <PlaceholderImage label="Driver-guide + car on a hill road" />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/86 to-transparent px-6 pt-10 pb-11 text-sm tracking-[0.04em] text-[#F7F3EB]">
                  {t("whyCaption")}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Regions */}
        <section id="regions" className="bg-deep2 text-od">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
            <p className="font-mono text-[11px] tracking-[0.26em] text-gold uppercase">
              {t("regKicker")}
            </p>
            <h2 className="mt-5 max-w-[24ch] font-serif text-4xl leading-none font-normal tracking-tight sm:text-6xl">
              {t("regH")}
            </h2>
            <p className="mt-5.5 max-w-[50ch] text-[17px] leading-relaxed text-od/72">
              {t("regBody")}
            </p>
          </div>

          {REGION_ROWS.map((row, idx) => (
            <article
              key={row.key}
              className="mx-auto grid max-w-6xl items-center gap-7 border-t border-od/14 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2"
            >
              <div
                className={`relative min-h-[260px] overflow-hidden rounded-[20px] shadow-2xl sm:min-h-[380px] ${
                  idx % 2 ? "lg:order-2" : ""
                }`}
              >
                <PlaceholderImage label={t(row.photo === "reg-cultural" ? "w1t" : "w2t")} />
              </div>
              <div className={idx % 2 ? "lg:order-1" : ""}>
                <p className="font-mono text-[10px] tracking-[0.24em] text-gold uppercase">
                  {t(row.kicker)}
                </p>
                <h3 className="mt-3.5 font-serif text-3xl leading-tight font-normal sm:text-5xl">
                  {t(row.title)} <span className="italic">{t(row.titleItalic)}</span>
                </h3>
                <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-od/72">
                  {t(row.body)}
                </p>
                <ul className="mt-5.5 flex flex-wrap gap-2.5 p-0">
                  {row.chips.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-od/22 px-3.5 py-1.5 text-xs tracking-[0.06em]"
                    >
                      {t(c)}
                    </li>
                  ))}
                </ul>
                <div className="mt-6.5 flex flex-wrap items-center gap-3.5">
                  <AddPlanButton
                    interestId={row.interest}
                    label={t("addPlan")}
                    className="rounded-full bg-gold/18 px-6 py-3.5 text-sm tracking-[0.04em] text-gold hover:bg-gold hover:text-[#061C1D]"
                  />
                  <Link
                    href={`/destinations/${row.dest}`}
                    className="rounded-full border border-od/22 px-5.5 py-3.5 text-sm tracking-[0.04em] text-od hover:border-gold hover:text-gold"
                  >
                    {t("navDest")} →
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* Wildlife — full bleed */}
          <article className="border-t border-od/14 px-4 py-14 sm:px-8 sm:py-20">
            <div className="relative mx-auto min-h-[340px] max-w-6xl overflow-hidden rounded-3xl shadow-2xl sm:min-h-[480px]">
              <PlaceholderImage label={t("w3t")} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/40 to-transparent" />
              <div className="absolute top-0 left-0 max-w-[80%] p-6 sm:max-w-[48ch] sm:p-12">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[#C58A5E] uppercase">
                  {t("w3k")}
                </p>
                <h3 className="mt-3.5 font-serif text-3xl leading-tight font-normal text-[#F7F3EB] sm:text-5xl">
                  {t("w3t")} <span className="italic">{t("w3t2")}</span>
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#F7F3EBd1]">
                  {t("w3b")}
                </p>
                <div className="pointer-events-auto mt-6.5 flex flex-wrap gap-3.5">
                  <AddPlanButton
                    interestId="wildlife"
                    label={t("addPlan")}
                    className="rounded-full bg-od/16 px-6 py-3.5 text-sm tracking-[0.04em] text-[#F7F3EB] backdrop-blur hover:bg-gold hover:text-[#061C1D]"
                  />
                  <Link
                    href="/destinations/yala-safari"
                    className="rounded-full border border-od/22 px-5.5 py-3.5 text-sm tracking-[0.04em] text-od hover:border-gold hover:text-gold"
                  >
                    {t("navDest")} →
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Coast */}
          <article className="mx-auto grid max-w-6xl items-center gap-7 border-t border-od/14 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden rounded-[20px] shadow-2xl sm:min-h-[380px]">
              <PlaceholderImage label="Galle Fort at dusk" />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.24em] text-[#E0B27A] uppercase">
                {t("w4k")}
              </p>
              <h3 className="mt-3.5 font-serif text-3xl leading-tight font-normal sm:text-5xl">
                {t("w4t")} <span className="italic">{t("w4t2")}</span>
              </h3>
              <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-od/72">
                {t("w4b")}
              </p>
              <ul className="mt-5.5 flex flex-wrap gap-2.5 p-0">
                {(["w4c1", "w4c2", "w4c3"] as const).map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-od/22 px-3.5 py-1.5 text-xs tracking-[0.06em]"
                  >
                    {t(c)}
                  </li>
                ))}
              </ul>
              <div className="mt-6.5 flex flex-wrap items-center gap-3.5">
                <AddPlanButton
                  interestId="beaches"
                  label={t("addPlan")}
                  className="rounded-full bg-gold/18 px-6 py-3.5 text-sm tracking-[0.04em] text-gold hover:bg-gold hover:text-[#061C1D]"
                />
                <Link
                  href="/destinations/galle-mirissa"
                  className="rounded-full border border-od/22 px-5.5 py-3.5 text-sm tracking-[0.04em] text-od hover:border-gold hover:text-gold"
                >
                  {t("navDest")} →
                </Link>
              </div>
            </div>
          </article>

          {/* Colombo */}
          <article className="border-t border-od/14 px-4 py-14 pb-20 sm:px-8 sm:py-20 sm:pb-28">
            <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] tracking-[0.24em] text-[#9FB8C4] uppercase">
                  {t("w5k")}
                </p>
                <h3 className="mt-3.5 font-serif text-3xl leading-tight font-normal sm:text-5xl">
                  {t("w5t")} <span className="italic">{t("w5t2")}</span>
                </h3>
                <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-od/72">
                  {t("w5b")}
                </p>
                <div className="mt-6.5 flex flex-wrap items-center gap-3.5">
                  <AddPlanButton
                    interestId="food"
                    label={t("addPlan")}
                    className="rounded-full bg-gold/18 px-6 py-3.5 text-sm tracking-[0.04em] text-gold hover:bg-gold hover:text-[#061C1D]"
                  />
                  <Link
                    href="/destinations/colombo"
                    className="rounded-full border border-od/22 px-5.5 py-3.5 text-sm tracking-[0.04em] text-od hover:border-gold hover:text-gold"
                  >
                    {t("navDest")} →
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="relative min-h-[160px] overflow-hidden rounded-2xl sm:min-h-[260px]">
                  <PlaceholderImage label="Colombo street food" />
                </div>
                <div className="relative mt-6 min-h-[160px] overflow-hidden rounded-2xl sm:min-h-[260px]">
                  <PlaceholderImage label="Bawa architecture interior" />
                </div>
              </div>
            </div>
          </article>
        </section>

        <TripPlanner />

        {/* How it works */}
        <section className="bg-bg px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-[20ch] font-serif text-3xl leading-tight font-normal tracking-tight sm:text-5xl">
              {t("howH")}
            </h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-3">
              {(
                [
                  ["h1t", "h1b", "border-ink"],
                  ["h2t", "h2b", "border-line-2"],
                  ["h3t", "h3b", "border-line-2"],
                ] as const
              ).map(([ti, b, border], i) => (
                <div key={ti} className={`border-t-2 pt-6 ${border}`}>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-terra">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 font-serif text-[28px] font-normal">{t(ti)}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/72">{t(b)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-bg-alt px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-[22ch] font-serif text-3xl leading-tight font-normal sm:text-5xl">
              {t("tstH")}
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              {(
                [
                  ["tst1", "tst1m", "Hanna & Jonas — Berlin", false],
                  ["tst2", "tst2m", "Ravi S. — Singapore", true],
                  ["tst3", "tst3m", "Yulia & Artem — Moscow", false],
                ] as const
              ).map(([q, meta, who, dark]) => (
                <figure
                  key={q}
                  className={`flex flex-col gap-4.5 rounded-[20px] p-7 transition-transform hover:-translate-y-1.5 ${
                    dark ? "bg-deep2 text-od" : "border border-line bg-surface"
                  }`}
                >
                  <blockquote className="font-serif text-[22px] leading-snug">
                    {t(q)}
                  </blockquote>
                  <figcaption
                    className={`mt-auto flex items-center gap-3 text-[13px] ${
                      dark ? "text-od/72" : "text-ink/72"
                    }`}
                  >
                    <span
                      className={`h-11 w-11 flex-none rounded-full ${
                        dark ? "bg-od/14" : "bg-ink/10"
                      }`}
                    />
                    <span>
                      {who}
                      <br />
                      <span className={dark ? "text-od/50" : "text-ink/50"}>
                        {t(meta)}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="bg-bg px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <h2 className="font-serif text-3xl leading-tight font-normal sm:text-5xl">
                {t("galH")}
              </h2>
              <p className="font-mono text-[11px] tracking-[0.2em] text-ink/50 uppercase">
                {t("galNote")}
              </p>
            </div>
            <div className="mt-8 grid auto-rows-[150px] grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Stilt fishermen, Koggala", "row-span-2"],
                ["Kandy lake", ""],
                ["Nine Arch Bridge", "col-span-2"],
                ["Rice & curry spread", ""],
                ["Elephants, Udawalawe", "row-span-2"],
                ["Galle rampart sunset", ""],
                ["Tea estate morning mist", "col-span-2"],
              ].map(([label, span]) => (
                <div
                  key={label}
                  className={`relative overflow-hidden rounded-2xl ${span}`}
                >
                  <PlaceholderImage label={label} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

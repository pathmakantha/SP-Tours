import { setRequestLocale } from "next-intl/server";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SiteImage } from "@/components/site-image";
import { StartersAndPlanner } from "@/components/starters-and-planner";
import { ReachUs } from "@/components/reach-us";
import { destList, FAQ } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";
import { HERO_PHOTOS, GALLERY_PHOTOS, destPhoto } from "@/lib/photos";
import type { Locale } from "@/i18n/routing";

const GALLERY_SPANS = ["row-span-2", "", "col-span-2", "", "row-span-2", "", "col-span-2"];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");
  const currentLocale = (await getLocale()) as Locale;
  const dests = destList(currentLocale);
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader variant="home" />
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
                <SiteImage
                  file={HERO_PHOTOS.sigiriya}
                  alt="Sigiriya rock at sunrise"
                  priority
                />
              </div>
              <div className="absolute top-[18%] right-[2%] h-[52%] w-[42%] overflow-hidden rounded-2xl border border-od/14 shadow-2xl">
                <SiteImage file={HERO_PHOTOS.teaPicker} alt="Tea picker, hill country" />
              </div>
              <div className="absolute bottom-[6%] left-[24%] hidden h-[240px] w-[220px] max-w-[38%] overflow-hidden rounded-2xl border border-od/22 shadow-2xl sm:block">
                <SiteImage file={HERO_PHOTOS.leopard} alt="Leopard, Yala" />
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section
          aria-label={t("trustLicensed")}
          className="border-t border-od/14 bg-deep2 px-4 py-5.5 text-od sm:px-8"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            <p className="flex items-baseline gap-2.5 text-sm text-od/72">
              <span className="font-serif text-2xl text-gold">
                {t("trustRating")}
              </span>
            </p>
            <p className="text-sm leading-snug text-od/72">{t("trustReviews")}</p>
            <p className="text-sm leading-snug text-od/72">{t("trustLicensed")}</p>
            <p className="text-sm leading-snug text-od/72">{t("trustNoDeposit")}</p>
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
                    dark ? "bg-deep2 text-od" : "border border-line bg-surface"
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
            </div>
          </div>
        </section>

        {/* Regions — simple destination grid */}
        <section
          id="regions"
          className="bg-deep2 px-4 py-16 text-od sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] tracking-[0.26em] text-gold uppercase">
              {t("regKicker")}
            </p>
            <h2 className="mt-5 max-w-[24ch] font-serif text-4xl leading-none font-normal tracking-tight sm:text-6xl">
              {t("regH")}
            </h2>
            <p className="mt-5.5 max-w-[50ch] text-[17px] leading-relaxed text-od/72">
              {t("regBody")}
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dests.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="flex flex-col overflow-hidden rounded-[18px] border border-od/14 bg-od/5 text-od transition-transform hover:-translate-y-1.5"
                >
                  <div className="relative min-h-[180px]">
                    <SiteImage file={destPhoto(d.slug, 0)} alt={d.name} />
                  </div>
                  <div className="p-5">
                    <p
                      className="font-mono text-[10px] tracking-[0.18em] uppercase"
                      style={{ color: d.tint }}
                    >
                      {d.region}
                    </p>
                    <h3 className="mt-2 font-serif text-[22px] leading-tight font-normal">
                      {d.name} →
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/tours"
              className="mt-7 inline-flex text-[14px] tracking-[0.04em] text-gold"
            >
              {t("exploreAll")}
            </Link>
          </div>
        </section>

        {/* Starter itineraries + trip planner (shared local state) */}
        <StartersAndPlanner />

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
              {GALLERY_PHOTOS.map((photo, i) => (
                <div
                  key={photo.file}
                  className={`relative overflow-hidden rounded-2xl ${
                    GALLERY_SPANS[i]
                  }`}
                >
                  <SiteImage file={photo.file} alt={photo.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-h"
        className="bg-bg-alt px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.26em] text-terra uppercase">
            {t("faqK")}
          </p>
          <h2
            id="faq-h"
            className="mt-4 max-w-[24ch] font-serif text-3xl leading-tight font-normal sm:text-5xl"
          >
            {t("faqH")}
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <details
                key={i}
                className="rounded-2xl border border-line bg-surface px-5.5 py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg leading-snug sm:text-xl">
                  <span>{f.q[currentLocale]}</span>
                  <span className="h-5.5 w-5.5 flex-none rounded-full border border-line-2" />
                </summary>
                <p className="mt-3.5 max-w-[70ch] text-[15.5px] leading-relaxed text-ink/72">
                  {f.a[currentLocale]}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ReachUs headingId="reach-h" background="bg-bg" />

      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

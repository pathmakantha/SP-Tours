import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Photo } from "@/components/photo";
import { FaqItem } from "@/components/faq-item";
import { HeroSearch } from "@/components/hero-search";
import { StarterGrid } from "@/components/starter-grid";
import { TripPlanner } from "@/components/trip-planner";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_TEL,
  WHATSAPP_NUMBER,
} from "@/lib/config";
import { FAQ, destList } from "@/lib/site-data";
import { waSimpleHref } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

const SECTION = "px-[clamp(14px,3vw,40px)] pt-[clamp(72px,10vh,120px)]";
const KICKER = "text-sm font-bold text-accent";
const H2 =
  "text-[clamp(28px,3.4vw,44px)] leading-[1.1] font-extrabold tracking-[-0.03em]";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const t = await getTranslations("site");
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });
  const dests = destList(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "#sptours",
        name: "SP Tours",
        description:
          "Private, custom tours across Sri Lanka with local driver-guides: cultural triangle, hill country, wildlife safaris and south coast beaches.",
        areaServed: { "@type": "Country", name: "Sri Lanka" },
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
          addressLocality: "Colombo",
        },
        availableLanguage: ["en", "de", "fr", "ru", "zh"],
        priceRange: "$$",
        openingHours: "Mo-Su 00:00-24:00",
      },
      {
        "@type": "TouristTrip",
        name: "Custom Sri Lanka Journey",
        touristType: ["Culture", "Wildlife", "Beach", "Adventure"],
        provider: { "@id": "#sptours" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q[locale],
          acceptedAnswer: { "@type": "Answer", text: f.a[locale] },
        })),
      },
    ],
  };

  const steps = [
    ["h1t", "h1b"],
    ["h2t", "h2b"],
    ["h3t", "h3b"],
  ] as const;

  const whys = [
    ["why1t", "why1b"],
    ["why2t", "why2b"],
    ["why3t", "why3b"],
    ["why4t", "why4b"],
  ] as const;

  const reviews = [
    ["tst1", "tst1m", "Hanna & Jonas, Berlin"],
    ["tst2", "tst2m", "Ravi S., Singapore"],
    ["tst3", "tst3m", "Yulia & Artem, Moscow"],
  ] as const;

  const contactRow =
    "flex min-h-14 items-center justify-between gap-3 rounded-xl px-4.5 text-ink hover:text-ink";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main id="top">
        {/* Hero */}
        <section
          aria-labelledby="hero-h"
          className="px-[clamp(10px,2vw,28px)] pt-[84px]"
        >
          <div className="relative mx-auto flex min-h-[min(80svh,780px)] max-w-[1400px] flex-col justify-end overflow-hidden rounded-[clamp(18px,2vw,28px)] bg-[#16302E]">
            <Photo
              label="Sigiriya from Pidurangala"
              sizes="(min-width: 1400px) 1400px, 100vw"
              className="object-[50%_56%]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,22,0)_25%,rgba(8,20,22,0.74)_100%)]" />
            <div className="relative max-w-[900px] px-[clamp(22px,5vw,64px)] pt-[clamp(24px,5vw,64px)] pb-[clamp(100px,13vh,132px)] text-white">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3.5 py-2 text-[13px] font-semibold backdrop-blur-md">
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-[#F2B33D]" />
                {t("heroKicker")}
              </p>
              <h1
                id="hero-h"
                className="mt-4.5 text-[clamp(38px,6vw,82px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance"
              >
                {t("heroL1")} {t("heroL2")}
                {t("heroL3")}
              </h1>
              <p className="mt-4.5 max-w-[58ch] text-[clamp(16px,1.3vw,18px)] leading-[1.6] text-pretty text-white/90">
                {t("heroBody")}
              </p>
            </div>
          </div>

          <div className="relative z-[2] mx-auto -mt-[68px] max-w-[1120px] px-[clamp(12px,3vw,32px)]">
            <HeroSearch />
          </div>

          <ul className="mx-auto mt-5.5 flex max-w-[1120px] list-none flex-wrap justify-center gap-x-7.5 gap-y-2.5 px-[clamp(12px,3vw,32px)] text-sm text-ink/72">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="tracking-[1px] text-star">
                ★★★★★
              </span>
              <strong className="font-bold text-ink">{t("trustRating")}</strong>
            </li>
            <li>{t("trustReviews")}</li>
            <li>{t("trustLicensed")}</li>
            <li>{t("trustNoDeposit")}</li>
          </ul>
        </section>

        {/* Destinations */}
        <section
          id="destinations"
          aria-labelledby="dest-h"
          className={SECTION}
        >
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={KICKER}>{t("regKicker")}</p>
                <h2 id="dest-h" className={`mt-2 max-w-[22ch] ${H2}`}>
                  {t("toursH")}
                </h2>
              </div>
              <Link
                href="/tours"
                className="flex min-h-11 items-center text-[15px] font-bold"
              >
                {t("exploreAll")}
              </Link>
            </div>
            <div className="mt-7 grid snap-x snap-mandatory auto-cols-[minmax(220px,1fr)] grid-flow-col gap-4.5 overflow-x-auto pb-2">
              {dests.map((d) => (
                <Link
                  key={d.slug}
                  href={d.href}
                  className="flex snap-start flex-col overflow-hidden rounded-[18px] border border-line bg-surface text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:text-ink hover:shadow-[0_24px_48px_-28px_var(--shadow)]"
                >
                  <div className="relative aspect-[4/5]">
                    <Photo
                      label={d.photo}
                      sizes="(min-width: 1240px) 240px, (min-width: 640px) 33vw, 70vw"
                    />
                    <span className="pointer-events-none absolute top-3 left-3 rounded-lg bg-white/92 px-2.5 py-1.5 text-xs font-bold text-[#0E1B1D]">
                      {d.region}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 px-4 pt-4 pb-4.5">
                    <h3 className="text-[19px] font-extrabold tracking-[-0.02em]">
                      {d.short}
                    </h3>
                    <p className="text-sm leading-normal text-ink/72">
                      {d.tagline}
                    </p>
                    <dl className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1 border-t border-line pt-3 text-[13px]">
                      <div className="flex gap-1.25">
                        <dt className="text-ink/58">{d.stayKey}:</dt>
                        <dd className="font-semibold">{d.stay}</dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Starter itineraries */}
        <section
          id="itineraries"
          aria-labelledby="itin-h"
          className={`${SECTION} pb-[clamp(72px,10vh,120px)]`}
        >
          <div className="mx-auto max-w-[1240px]">
            <p className={KICKER}>{t("startersK")}</p>
            <h2 id="itin-h" className={`mt-2 max-w-[24ch] ${H2}`}>
              {t("startersH")}
            </h2>
            <p className="mt-3 max-w-[56ch] text-base leading-[1.6] text-ink/72">
              {t("startersB")}
            </p>
            <StarterGrid />
          </div>
        </section>

        <TripPlanner />

        {/* How it works */}
        <section id="how" aria-labelledby="how-h" className={SECTION}>
          <div className="mx-auto max-w-[1240px]">
            <h2 id="how-h" className={`max-w-[22ch] ${H2}`}>
              {t("howH")}
            </h2>
            <ol className="mt-7.5 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4.5 p-0">
              {steps.map(([ti, b], i) => (
                <li
                  key={ti}
                  className="flex flex-col gap-3 rounded-[18px] bg-bg-alt p-6.5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-base font-extrabold text-accent-ink">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-[-0.02em]">
                    {t(ti)}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-ink/72">
                    {t(b)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why us */}
        <section id="why" aria-labelledby="why-h" className={SECTION}>
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(28px,4vw,56px)]">
            <div className="relative min-h-[clamp(320px,52vh,520px)] overflow-hidden rounded-[22px]">
              <Photo
                label="Jeep track at dawn, 4:5"
                sizes="(min-width: 1024px) 600px, 100vw"
              />
            </div>
            <div>
              <h2 id="why-h" className={`max-w-[20ch] ${H2}`}>
                {t("whyL1")} {t("whyL2")}
                {t("whyL3")}
              </h2>
              <p className="mt-3.5 max-w-[52ch] text-base leading-[1.65] text-ink/72">
                {t("whyBody")}
              </p>
              <div className="mt-7.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-7 gap-y-5.5">
                {whys.map(([ti, b]) => (
                  <div key={ti} className="border-t-2 border-accent pt-4">
                    <h3 className="text-[17px] leading-[1.3] font-extrabold tracking-[-0.01em]">
                      {t(ti)}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.6] text-ink/72">
                      {t(b)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section aria-labelledby="tst-h" className={SECTION}>
          <div className="mx-auto max-w-[1240px]">
            <h2 id="tst-h" className={`max-w-[22ch] ${H2}`}>
              {t("tstH")}
            </h2>
            <div className="mt-7.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4.5">
              {reviews.map(([q, meta, who]) => (
                <figure
                  key={q}
                  className="flex flex-col gap-4 rounded-[18px] border border-line bg-surface p-6.5"
                >
                  <span
                    aria-hidden="true"
                    className="text-[15px] tracking-[2px] text-star"
                  >
                    ★★★★★
                  </span>
                  <blockquote className="text-[16.5px] leading-[1.6]">
                    {t(q)}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent-soft text-base font-extrabold text-accent"
                    >
                      {who.charAt(0)}
                    </span>
                    <span className="block text-sm">
                      <strong className="block font-bold">{who}</strong>
                      <span className="text-ink/58">{t(meta)}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ + direct contact */}
        <section id="faq" aria-labelledby="faq-h" className={SECTION}>
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(28px,4vw,64px)]">
            <div>
              <p className={KICKER}>{t("faqK")}</p>
              <h2 id="faq-h" className={`mt-2 max-w-[18ch] ${H2}`}>
                {t("faqH")}
              </h2>
              <div className="mt-7 flex flex-col gap-2.5">
                <a
                  href={waSimple}
                  target="_blank"
                  rel="noopener"
                  className={`${contactRow} bg-accent-soft`}
                >
                  <span className="font-bold">WhatsApp</span>
                  <span className="text-sm text-ink/72">+{WHATSAPP_NUMBER}</span>
                </a>
                <a
                  href={`tel:${CONTACT_TEL}`}
                  className={`${contactRow} bg-bg-alt`}
                >
                  <span className="font-bold">{t("contactPhone")}</span>
                  <span className="text-sm text-ink/72">{CONTACT_PHONE}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`${contactRow} bg-bg-alt`}
                >
                  <span className="font-bold">{t("contactEmail")}</span>
                  <span className="text-sm text-ink/72">{CONTACT_EMAIL}</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col">
              {FAQ.map((f) => (
                <FaqItem
                  key={f.q.en}
                  question={f.q[locale]}
                  answer={f.a[locale]}
                />
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

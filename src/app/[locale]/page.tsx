import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Photo } from "@/components/photo";
import { FaqItem } from "@/components/faq-item";
import { Parallax } from "@/components/parallax";
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
import { ORG_ID, jsonLdHtml, localizedUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const meta = pageMetadata({
    locale: locale as Locale,
    path: "/",
    description: t("description"),
  });
  return {
    ...meta,
    title: { absolute: t("title") },
    openGraph: { ...meta.openGraph, title: t("title") },
    twitter: { ...meta.twitter, title: t("title") },
  };
}

const SECTION_PAD = "px-4 sm:px-[clamp(16px,4vw,56px)]";
const H2 =
  "font-serif font-normal tracking-[-0.02em] leading-none text-[clamp(36px,5.2vw,74px)]";
const KICKER = "text-[11px] tracking-[0.26em] uppercase";

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
        "@type": "TouristTrip",
        name: "Custom Sri Lanka Journey",
        touristType: ["Culture", "Wildlife", "Beach", "Adventure"],
        provider: { "@id": ORG_ID },
        itinerary: {
          "@type": "ItemList",
          itemListElement: dests.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "TouristDestination",
              name: d.name,
              url: localizedUrl(locale, d.href),
            },
          })),
        },
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

  const why = [
    ["why1k", "why1t", "why1b", false],
    ["why2k", "why2t", "why2b", true],
    ["why3k", "why3t", "why3b", false],
    ["why4k", "why4t", "why4b", false],
  ] as const;

  const how = [
    ["h1t", "h1b", "border-ink"],
    ["h2t", "h2b", "border-line-2"],
    ["h3t", "h3b", "border-line-2"],
  ] as const;

  const testimonials = [
    ["tst1", "tst1m", "Hanna & Jonas, Berlin", false],
    ["tst2", "tst2m", "Ravi S., Singapore", true],
    ["tst3", "tst3m", "Yulia & Artem, Moscow", false],
  ] as const;

  const gallery = [
    ["Stilt fishermen, Koggala", "row-span-2"],
    ["Kandy lake", ""],
    ["Nine Arch Bridge", "col-span-2"],
    ["Rice & curry spread", ""],
    ["Elephants, Udawalawe", "row-span-2"],
    ["Galle rampart sunset", ""],
    ["Tea estate morning mist", "col-span-2"],
  ] as const;

  const contactCard =
    "flex flex-col gap-2 rounded-[18px] p-6 transition-transform duration-400 hover:-translate-y-[5px]";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(jsonLd)}
      />
      <SiteHeader />
      <main id="top">
        {/* Hero */}
        <section
          aria-labelledby="hero-h"
          className={`relative min-h-svh overflow-hidden bg-deep pt-[clamp(112px,15vh,180px)] pb-[clamp(48px,8vh,96px)] text-od ${SECTION_PAD}`}
        >
          <Parallax
            speed={0.06}
            className="pointer-events-none absolute -top-[8%] -right-[20%] size-[min(70vw,720px)] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 68%)",
            }}
          />
          <Parallax
            speed={-0.04}
            className="pointer-events-none absolute -bottom-[18%] -left-[14%] size-[min(60vw,620px)] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 60% 40%, color-mix(in oklab, var(--terra) 26%, transparent), transparent 70%)",
            }}
          />

          <div className="relative mx-auto grid max-w-[1440px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(20px,3vw,48px)]">
            <div className="max-w-[760px]" data-reveal>
              <p
                className={`mb-6.5 flex items-center gap-3 text-gold-t ${KICKER}`}
              >
                <span className="block h-px w-11 flex-none bg-gold" />
                {t("heroKicker")}
              </p>
              <h1
                id="hero-h"
                className="font-serif text-[clamp(40px,7.6vw,108px)] leading-[0.96] font-normal tracking-[-0.02em]"
              >
                {t("heroL1")}{" "}
                <span className="text-gold-t italic">{t("heroL2")}</span>
                {t("heroL3")}
              </h1>
              <p className="mt-[clamp(20px,3vh,32px)] max-w-[54ch] text-[clamp(16px,1.3vw,19px)] leading-[1.62] text-balance text-od/72">
                {t("heroBody")}
              </p>
              <div className="mt-[clamp(28px,4vh,40px)] flex flex-wrap gap-3.5">
                <a
                  href="#planner"
                  className="rounded-full bg-gold px-7.5 py-4.25 text-[15px] font-medium tracking-[0.02em] text-[#1A1206] shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--gold)_70%,transparent)] hover:bg-od hover:text-bg"
                >
                  {t("ctaStart")}
                </a>
                <a
                  href={waSimple}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2.5 rounded-full border border-od/22 px-7 py-4.25 text-[15px] text-od hover:border-gold-t hover:bg-gold/12 hover:text-od"
                >
                  <span className="h-2 w-2 flex-none rounded-full bg-green" />
                  {t("ctaWa")}
                </a>
              </div>
              <dl className="mt-[clamp(40px,6vh,64px)] flex flex-wrap gap-[clamp(22px,4vw,56px)] border-t border-od/14 pt-6.5">
                {(
                  [
                    ["stat1k", "1,200+"],
                    ["stat2k", t("stat2v")],
                    ["stat3k", "14"],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10px] tracking-[0.2em] text-od/50 uppercase">
                      {t(k)}
                    </dt>
                    <dd className="mt-1.5 font-serif text-[34px]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              aria-hidden="true"
              className="relative mt-[clamp(28px,5vh,8px)] h-[clamp(320px,50vh,540px)] [perspective:1400px]"
            >
              <Parallax
                speed={0.08}
                baseTransform="rotateY(-16deg) rotateX(6deg) rotateZ(-3deg)"
                className="absolute top-[2%] left-[6%] h-[74%] w-[60%] overflow-hidden rounded-[18px] border border-od/14 shadow-[0_50px_80px_-40px_rgba(0,0,0,0.75)]"
              >
                <Photo label="Sigiriya rock at sunrise" sizes="(min-width: 1024px) 32vw, 60vw" priority />
              </Parallax>
              <Parallax
                speed={0.14}
                baseTransform="rotateY(-13deg) rotateX(4deg) rotateZ(2.5deg)"
                className="absolute top-[20%] right-[2%] h-[56%] w-[46%] overflow-hidden rounded-[18px] border border-od/14 shadow-[0_40px_70px_-34px_rgba(0,0,0,0.7)]"
              >
                <Photo label="Tea picker, hill country" sizes="(min-width: 1024px) 24vw, 46vw" priority />
              </Parallax>
              <Parallax
                speed={0.2}
                baseTransform="rotateY(-10deg) rotateZ(-1.5deg)"
                className="absolute -bottom-[2%] left-[22%] h-[38%] w-[38%] overflow-hidden rounded-2xl border border-od/22 shadow-[0_34px_60px_-28px_rgba(0,0,0,0.7)]"
              >
                <Photo label="Leopard, Yala" sizes="(min-width: 1024px) 20vw, 38vw" />
              </Parallax>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section
          aria-label={t("trustLicensed")}
          className={`border-t border-od/14 bg-deep2 py-5.5 text-od ${SECTION_PAD}`}
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-center gap-x-7 gap-y-4.5">
            <p className="font-serif text-[26px] text-gold-t">
              {t("trustRating")}
            </p>
            {(["trustReviews", "trustLicensed", "trustNoDeposit"] as const).map(
              (k) => (
                <p key={k} className="text-sm leading-normal text-od/72">
                  {t(k)}
                </p>
              ),
            )}
          </div>
        </section>

        {/* Why us */}
        <section
          id="why"
          aria-labelledby="why-h"
          className={`bg-bg py-[clamp(72px,12vh,148px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1280px]">
            <div
              data-reveal
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-end gap-[clamp(20px,3vw,48px)]"
            >
              <h2 id="why-h" className={`max-w-[18ch] ${H2}`}>
                {t("whyL1")}{" "}
                <span className="text-terra italic">{t("whyL2")}</span>
                {t("whyL3")}
              </h2>
              <p className="max-w-[46ch] text-[17px] leading-[1.65] text-balance text-ink/72">
                {t("whyBody")}
              </p>
            </div>
            <div className="mt-[clamp(44px,7vh,84px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(18px,2.4vw,32px)]">
              {why.map(([k, ti, b, dark]) => (
                <article
                  key={k}
                  data-reveal
                  className={`flex flex-col gap-3.75 rounded-[20px] p-[clamp(24px,3vw,38px)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.25,1)] hover:-translate-y-1.5 ${
                    dark
                      ? "bg-deep2 text-od"
                      : "border border-line bg-surface"
                  }`}
                >
                  <span
                    className={`text-[10px] tracking-[0.22em] ${
                      dark ? "text-gold-t" : "text-terra"
                    }`}
                  >
                    {t(k)}
                  </span>
                  <h3 className="font-serif text-[clamp(24px,2.3vw,32px)] leading-[1.12] font-normal">
                    {t(ti)}
                  </h3>
                  <p
                    className={`text-[15px] leading-[1.66] ${
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

        {/* Regions */}
        <section
          id="regions"
          aria-labelledby="regions-h"
          className={`bg-deep2 py-[clamp(72px,12vh,140px)] text-od ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1280px]" data-reveal>
            <p className={`text-gold-t ${KICKER}`}>{t("regKicker")}</p>
            <h2 id="regions-h" className={`mt-5 max-w-[24ch] ${H2}`}>
              {t("regH")}
            </h2>
            <p className="mt-5.5 max-w-[50ch] text-[17px] leading-[1.65] text-od/72">
              {t("regBody")}
            </p>

            <div className="mt-[clamp(40px,6vh,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(16px,2vw,26px)]">
              {dests.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="flex flex-col overflow-hidden rounded-[18px] border border-od/14 bg-surface text-od shadow-[0_20px_44px_-30px_var(--shadow)] transition-transform duration-400 hover:-translate-y-1.5 hover:text-od"
                >
                  <div className="relative min-h-[180px]">
                    <Photo label={d.photo} sizes="(min-width: 1024px) 20vw, 90vw" />
                  </div>
                  <div className="p-5">
                    <p
                      className="text-[10px] tracking-[0.18em] uppercase"
                      style={{ color: d.tint }}
                    >
                      {d.region}
                    </p>
                    <h3 className="mt-2 font-serif text-[22px] leading-[1.15] font-normal">
                      {d.name} →
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/tours"
              className="mt-7 inline-flex text-sm tracking-[0.04em] text-gold-t hover:text-od"
            >
              {t("exploreAll")}
            </Link>
          </div>
        </section>

        {/* Starter trips */}
        <section
          id="starters"
          aria-labelledby="starters-h"
          className={`bg-bg py-[clamp(64px,10vh,120px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1280px]">
            <div data-reveal>
              <p className={`text-terra ${KICKER}`}>{t("startersK")}</p>
              <h2
                id="starters-h"
                className="mt-4 max-w-[24ch] font-serif text-[clamp(30px,4.2vw,58px)] leading-[1.04] font-normal"
              >
                {t("startersH")}
              </h2>
              <p className="mt-3.5 max-w-[50ch] text-base leading-[1.6] text-ink/72">
                {t("startersB")}
              </p>
            </div>
            <StarterGrid />
          </div>
        </section>

        <TripPlanner />

        {/* How it works */}
        <section
          id="how"
          aria-labelledby="how-h"
          className={`bg-bg py-[clamp(72px,11vh,130px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1280px]">
            <h2
              id="how-h"
              data-reveal
              className="max-w-[20ch] font-serif text-[clamp(32px,4.4vw,62px)] leading-[1.02] font-normal tracking-[-0.02em]"
            >
              {t("howH")}
            </h2>
            <div className="mt-[clamp(36px,6vh,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(18px,2.4vw,32px)]">
              {how.map(([ti, b, border], i) => (
                <div
                  key={ti}
                  data-reveal
                  className={`border-t-2 pt-6 ${border}`}
                >
                  <p className="text-[11px] tracking-[0.2em] text-terra">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 font-serif text-[28px] font-normal">
                    {t(ti)}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.62] text-ink/72">
                    {t(b)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          aria-labelledby="tst-h"
          className={`bg-bg-alt py-[clamp(72px,11vh,130px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1280px]">
            <h2
              id="tst-h"
              data-reveal
              className="max-w-[22ch] font-serif text-[clamp(30px,4vw,56px)] leading-[1.04] font-normal"
            >
              {t("tstH")}
            </h2>
            <div className="mt-[clamp(34px,5vh,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-[clamp(16px,2vw,28px)]">
              {testimonials.map(([q, meta, who, dark]) => (
                <figure
                  key={q}
                  data-reveal
                  className={`flex flex-col gap-4.5 rounded-[20px] p-[clamp(22px,2.6vw,34px)] ${
                    dark ? "bg-deep2 text-od" : "border border-line bg-surface"
                  }`}
                >
                  <blockquote className="font-serif text-[22px] leading-[1.34]">
                    {t(q)}
                  </blockquote>
                  <figcaption
                    className={`mt-auto flex items-center gap-3 text-[13px] ${
                      dark ? "text-od/72" : "text-ink/72"
                    }`}
                  >
                    <span
                      aria-hidden="true"
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
        <section
          id="gallery"
          aria-labelledby="gal-h"
          className={`bg-bg py-[clamp(72px,11vh,130px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1360px]">
            <div
              data-reveal
              className="flex flex-wrap items-end justify-between gap-5"
            >
              <h2
                id="gal-h"
                className="font-serif text-[clamp(30px,4vw,56px)] leading-[1.04] font-normal"
              >
                {t("galH")}
              </h2>
              <p className="text-[11px] tracking-[0.2em] text-ink/50 uppercase">
                {t("galNote")}
              </p>
            </div>
            <div
              data-reveal
              className="mt-[clamp(30px,5vh,52px)] grid grid-flow-dense auto-rows-[clamp(130px,17vh,180px)] grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-[clamp(10px,1.4vw,18px)]"
            >
              {gallery.map(([label, span]) => (
                <div
                  key={label}
                  className={`relative overflow-hidden rounded-2xl ${span}`}
                >
                  <Photo label={label} sizes="(min-width: 1024px) 25vw, 50vw" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-h"
          className={`bg-bg-alt py-[clamp(64px,10vh,120px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1000px]">
            <div data-reveal>
              <p className={`text-terra ${KICKER}`}>{t("faqK")}</p>
              <h2
                id="faq-h"
                className="mt-4 max-w-[24ch] font-serif text-[clamp(30px,4.2vw,56px)] leading-[1.04] font-normal"
              >
                {t("faqH")}
              </h2>
            </div>
            <div
              data-reveal
              className="mt-[clamp(28px,4vh,44px)] flex flex-col gap-3"
            >
              {FAQ.map((f) => (
                <FaqItem key={f.q.en} question={f.q[locale]} answer={f.a[locale]} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact cards */}
        <section
          aria-labelledby="reach-h"
          className={`bg-bg py-[clamp(56px,8vh,100px)] ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-[1280px]">
            <h2
              id="reach-h"
              data-reveal
              className="max-w-[20ch] font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.04] font-normal"
            >
              {t("contactH")}
            </h2>
            <div
              data-reveal
              className="mt-[clamp(26px,4vh,40px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(14px,1.8vw,22px)]"
            >
              <a
                href={waSimple}
                target="_blank"
                rel="noopener"
                className={`${contactCard} bg-green text-green-ink hover:text-green-ink`}
              >
                <span className="text-[10px] tracking-[0.18em] uppercase opacity-75">
                  WhatsApp
                </span>
                <span className="font-serif text-2xl">+{WHATSAPP_NUMBER}</span>
                <span className="text-[13.5px] leading-normal opacity-85">
                  {t("contactWa")}
                </span>
              </a>
              <a
                href={`tel:${CONTACT_TEL}`}
                className={`${contactCard} border border-line bg-surface text-ink hover:text-ink`}
              >
                <span className="text-[10px] tracking-[0.18em] text-terra uppercase">
                  {t("contactPhone")}
                </span>
                <span className="font-serif text-2xl">{CONTACT_PHONE}</span>
                <span className="text-[13.5px] leading-normal text-ink/72">
                  {t("contactHours")}
                </span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={`${contactCard} border border-line bg-surface text-ink hover:text-ink`}
              >
                <span className="text-[10px] tracking-[0.18em] text-terra uppercase">
                  {t("contactEmail")}
                </span>
                <span className="font-serif text-2xl">{CONTACT_EMAIL}</span>
                <span className="text-[13.5px] leading-normal text-ink/72">
                  {t("ftLangs")}
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

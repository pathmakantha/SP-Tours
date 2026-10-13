import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Photo } from "@/components/photo";
import { SeedInterest } from "@/components/seed-interest";
import { TripPlanner } from "@/components/trip-planner";
import { DESTINATIONS, DEST_ORDER, REGIONS } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

const PAD = "px-[clamp(14px,3vw,40px)]";
const H2 =
  "text-[clamp(28px,3.4vw,44px)] leading-[1.1] font-extrabold tracking-[-0.03em]";

export function generateStaticParams() {
  return DEST_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = DESTINATIONS[slug];
  if (!d) return {};
  const l = locale as Locale;
  return { title: `${d.name[l]} — SP Tours`, description: d.meta[l] };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const d = DESTINATIONS[slug];
  if (!d) notFound();
  const l = locale as Locale;
  const t = await getTranslations("site");
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });
  const region = REGIONS[d.region].label[l];
  const plannerHeading = `${t("plannerHereH")} ${d.short[l]}`;

  return (
    <>
      <SeedInterest interestId={d.interest} />
      <SiteHeader />
      <main id="top">
        {/* Hero */}
        <section
          aria-labelledby="dest-h"
          className="px-[clamp(10px,2vw,28px)] pt-[84px]"
        >
          <div className="relative mx-auto flex min-h-[min(74svh,720px)] max-w-[1400px] flex-col justify-end overflow-hidden rounded-[clamp(18px,2vw,28px)] bg-[#16302E]">
            <Photo
              label={d.photos[0]}
              sizes="(min-width: 1400px) 1400px, 100vw"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,22,0.35)_0%,rgba(8,20,22,0)_26%,rgba(8,20,22,0)_40%,rgba(8,20,22,0.76)_100%)]" />
            <nav
              aria-label="Breadcrumb"
              className="absolute top-0 left-0 px-[clamp(22px,5vw,64px)] py-[clamp(18px,3vw,32px)]"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-sm font-semibold text-white/86">
                <li>
                  <Link href="/" className="text-white hover:text-white/80">
                    {t("crumbHome")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/tours" className="text-white hover:text-white/80">
                    {t("navTours")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{d.short[l]}</li>
              </ol>
            </nav>
            <div className="relative max-w-[880px] px-[clamp(22px,5vw,64px)] pt-[clamp(24px,5vw,64px)] pb-[clamp(96px,12vh,124px)] text-white">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3.5 py-2 text-[13px] font-semibold backdrop-blur-md">
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-[#F2B33D]" />
                {region}
              </p>
              <h1
                id="dest-h"
                className="mt-4.5 text-[clamp(36px,5.6vw,76px)] leading-[1.03] font-extrabold tracking-[-0.035em] text-balance"
              >
                {d.name[l]}
              </h1>
              <p className="mt-4 max-w-[54ch] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-white/90">
                {d.tagline[l]}
              </p>
              <div className="mt-6.5 flex flex-wrap gap-3">
                <a
                  href="#planner"
                  className="flex min-h-[52px] items-center rounded-xl bg-accent px-5.5 text-[15px] font-bold text-accent-ink transition-[filter] hover:text-accent-ink hover:brightness-110"
                >
                  {plannerHeading} →
                </a>
                <Link
                  href="/tours"
                  className="flex min-h-[52px] items-center rounded-xl bg-white/16 px-5 text-[15px] font-bold text-white backdrop-blur-md hover:bg-white/26 hover:text-white"
                >
                  {t("allDest")}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative z-[2] mx-auto -mt-15 max-w-[1120px] px-[clamp(12px,3vw,32px)]">
            <dl className="flex flex-wrap gap-2 rounded-[20px] bg-surface p-2.5 shadow-[0_34px_70px_-30px_var(--shadow),0_0_0_1px_var(--line)]">
              {d.facts[l].map(([k, v]) => (
                <div
                  key={k}
                  className="flex-[1_1_200px] rounded-[14px] bg-field px-4.5 py-3.5"
                >
                  <dt className="text-xs font-semibold text-ink/58">{k}</dt>
                  <dd className="mt-1 text-lg font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Intro + highlights */}
        <section
          aria-labelledby="dest-intro-h"
          className={`${PAD} pt-[clamp(72px,10vh,120px)] pb-[clamp(72px,10vh,120px)]`}
        >
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(28px,4vw,64px)]">
            <div>
              <p className="text-sm font-bold text-accent">{region}</p>
              <h2 id="dest-intro-h" className={`mt-2 max-w-[20ch] ${H2}`}>
                {t("highlightsH")}
              </h2>
              <p className="mt-4 max-w-[60ch] text-[16.5px] leading-[1.7] text-ink/72">
                {d.intro1[l]}
              </p>
              <p className="mt-3.5 max-w-[60ch] text-[16.5px] leading-[1.7] text-ink/72">
                {d.intro2[l]}
              </p>
            </div>
            <ol className="m-0 grid list-none gap-3 p-0">
              {d.hi.map((h, i) => (
                <li key={i} className="flex gap-4 rounded-2xl bg-bg-alt p-5">
                  <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-accent-ink">
                    {i + 1}
                  </span>
                  <span className="block">
                    <span className="block text-[17px] leading-[1.3] font-extrabold">
                      {h[l][0]}
                    </span>
                    <span className="mt-1.5 block text-[14.5px] leading-[1.6] text-ink/72">
                      {h[l][1]}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto mt-7 grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5">
            {d.photos.slice(1).map((photo) => (
              <div
                key={photo}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Photo
                  label={photo}
                  sizes="(min-width: 1240px) 400px, (min-width: 780px) 33vw, 100vw"
                />
              </div>
            ))}
          </div>
        </section>

        <TripPlanner heading={plannerHeading} lede={t("plannerHereB")} />

        {/* Nearby */}
        <section
          aria-labelledby="dest-nearby-h"
          className={`${PAD} pt-[clamp(72px,10vh,120px)]`}
        >
          <div className="mx-auto max-w-[1240px]">
            <h2 id="dest-nearby-h" className={H2}>
              {t("nearbyH")}
            </h2>
            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4.5">
              {d.nearby.map((s) => {
                const n = DESTINATIONS[s];
                return (
                  <Link
                    key={s}
                    href={`/destinations/${s}`}
                    className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:text-ink hover:shadow-[0_24px_48px_-28px_var(--shadow)]"
                  >
                    <div className="relative aspect-[16/10]">
                      <Photo
                        label={n.photos[0]}
                        sizes="(min-width: 1240px) 400px, (min-width: 600px) 50vw, 100vw"
                      />
                    </div>
                    <div className="px-4.5 pt-4 pb-4.5">
                      <p className="text-[12.5px] font-bold text-accent">
                        {REGIONS[n.region].label[l]}
                      </p>
                      <h3 className="mt-1 text-[19px] font-extrabold tracking-[-0.02em]">
                        {n.short[l]} →
                      </h3>
                    </div>
                  </Link>
                );
              })}
              <Link
                href="/tours"
                className="flex min-h-[200px] flex-col justify-end gap-2 rounded-[18px] bg-accent-soft p-5.5 text-ink transition-transform duration-300 hover:-translate-y-1 hover:text-ink"
              >
                <span className="text-[13px] font-bold text-accent">
                  {t("allDest")}
                </span>
                <span className="text-xl font-extrabold tracking-[-0.02em]">
                  {t("exploreAll")}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

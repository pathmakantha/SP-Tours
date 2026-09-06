import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ReachUs } from "@/components/reach-us";
import { SiteImage } from "@/components/site-image";
import { LocalPlanner } from "@/components/local-planner";
import { DESTINATIONS, DEST_ORDER, REGIONS } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";
import { destPhoto } from "@/lib/photos";
import type { Locale } from "@/i18n/routing";

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
  const l = (await getLocale()) as Locale;
  const t = await getTranslations("site");
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <>
      <SiteHeader variant="destination" plannerHash="#dest-planner" />
      <main className="pt-[62px]">
        <section className="relative min-h-[88svh] bg-deep px-4 pt-14 pb-12 text-od sm:px-8 sm:pt-16 sm:pb-20">
          <div className="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-2">
            <div>
              <nav aria-label="Breadcrumb" className="mb-4.5">
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13px] text-od/50">
                  <li>
                    <Link href="/" className="text-od/72">
                      {t("crumbHome")}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href="/tours" className="text-od/72">
                      {t("navTours")}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li aria-current="page" className="text-od">
                    {d.short[l]}
                  </li>
                </ol>
              </nav>
              <p
                className="font-mono text-[11px] tracking-[0.24em] uppercase"
                style={{ color: d.tint }}
              >
                {t("regionK")} · {REGIONS[d.region].label[l]}
              </p>
              <h1 className="mt-4.5 font-serif text-4xl leading-none font-normal tracking-tight sm:text-7xl">
                {d.name[l]}
              </h1>
              <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-od/80 sm:text-lg">
                {d.tagline[l]}
              </p>
              <div className="mt-7.5 flex flex-wrap gap-3.5">
                <a
                  href="#dest-planner"
                  className="rounded-full bg-gold px-6.5 py-4 text-[15px] font-medium text-[#061C1D] hover:bg-od"
                >
                  {t("plannerHereH")} {d.short[l]} →
                </a>
                <Link
                  href="/tours"
                  className="flex items-center rounded-full border border-od/22 px-6 py-4 text-[15px] text-od hover:border-gold"
                >
                  {t("allDest")}
                </Link>
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-[20px] shadow-2xl sm:min-h-[460px]">
              <SiteImage file={destPhoto(slug, 0)} alt={d.photos[0]} priority />
            </div>
          </div>
        </section>

        <section className="bg-bg px-4 py-14 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="max-w-[22ch] font-serif text-3xl leading-tight font-normal sm:text-5xl">
              {t("highlightsH")}
            </h2>
            <p className="mt-5 max-w-[64ch] text-[16.5px] leading-[1.7] text-ink/72">
              {d.intro1[l]}
            </p>
            <p className="mt-4.5 max-w-[64ch] text-[16.5px] leading-[1.7] text-ink/72">
              {d.intro2[l]}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.hi.map((h, i) => (
              <article
                key={i}
                className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-surface p-6 transition-transform hover:-translate-y-1.5"
              >
                <h3 className="font-serif text-[22px] leading-tight font-normal">
                  {h[l][0]}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-ink/72">
                  {h[l][1]}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-6.5 grid max-w-6xl gap-3.5 sm:grid-cols-3">
            {d.photos.slice(1).map((photo, i) => (
              <div
                key={photo}
                className="relative min-h-[220px] overflow-hidden rounded-2xl"
              >
                <SiteImage file={destPhoto(slug, (i + 1) as 1 | 2 | 3)} alt={photo} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-bg-alt px-4 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-[26px] leading-tight font-normal sm:text-[40px]">
              {t("practicalH")}
            </h2>
            <dl className="mt-6.5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {d.facts[l].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <dt className="font-mono text-[10px] tracking-[0.16em] text-ink/50 uppercase">
                    {k}
                  </dt>
                  <dd className="mt-2 font-serif text-[22px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="dest-planner"
          aria-labelledby="dest-plan-h"
          className="bg-gradient-to-b from-bg to-bg-alt px-4 py-14 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] tracking-[0.24em] text-terra uppercase">
              {t("plKicker")}
            </p>
            <h2
              id="dest-plan-h"
              className="mt-4 max-w-[24ch] font-serif text-3xl leading-tight font-normal sm:text-5xl"
            >
              {t("plannerHereH")} {d.short[l]}
            </h2>
            <p className="mt-3.5 max-w-[52ch] text-base leading-relaxed text-ink/72">
              {t("plannerHereB")}
            </p>
            <div className="mt-9">
              <LocalPlanner presetInterest={d.interest} />
            </div>
          </div>
        </section>

        <section className="bg-bg px-4 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-[26px] leading-tight font-normal sm:text-[40px]">
              {t("nearbyH")}
            </h2>
            <div className="mt-6.5 grid gap-4 sm:grid-cols-3">
              {d.nearby.map((nearbySlug) => {
                const n = DESTINATIONS[nearbySlug];
                return (
                  <Link
                    key={nearbySlug}
                    href={`/destinations/${nearbySlug}`}
                    className="block rounded-2xl border border-line bg-surface p-5.5 text-ink transition-transform hover:-translate-y-1"
                  >
                    <span className="font-mono text-[10px] tracking-[0.16em] text-terra uppercase">
                      {t("navDest")}
                    </span>
                    <span className="mt-2 block font-serif text-2xl">
                      {n.short[l]} →
                    </span>
                  </Link>
                );
              })}
              <Link
                href="/tours"
                className="block rounded-2xl bg-deep2 p-5.5 text-od transition-transform hover:-translate-y-1"
              >
                <span className="font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                  {t("allDest")}
                </span>
                <span className="mt-2 block font-serif text-2xl">
                  {t("exploreAll")}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ReachUs headingId="dest-reach-h" background="bg-bg-alt" />

      <MinimalFooter showLegal />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SiteImage } from "@/components/site-image";
import { AddPlanButton } from "@/components/add-plan-button";
import { SeedInterest } from "@/components/seed-interest";
import { TripPlanner } from "@/components/trip-planner";
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
      <SeedInterest interestId={d.interest} />
      <SiteHeader />
      <main className="pt-[62px]">
        <section className="bg-deep px-4 py-20 text-od sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-od/50 uppercase"
            >
              <Link href="/" className="hover:text-gold">
                {t("navHome")}
              </Link>
              <span>/</span>
              <Link href="/tours" className="hover:text-gold">
                {t("navDest")}
              </Link>
              <span>/</span>
              <span className="text-gold">{d.short[l]}</span>
            </nav>
            <div className="mt-7 grid items-end gap-9 lg:grid-cols-2">
              <div>
                <p
                  className="font-mono text-[11px] tracking-[0.24em] uppercase"
                  style={{ color: d.tint }}
                >
                  {REGIONS[d.region].label[l]}
                </p>
                <h1 className="mt-4 font-serif text-5xl leading-[0.98] font-normal tracking-tight sm:text-7xl">
                  {d.name[l]}
                </h1>
                <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-od/72 sm:text-lg">
                  {d.tagline[l]}
                </p>
                <div className="mt-7 flex flex-wrap gap-3.5">
                  <AddPlanButton
                    interestId={d.interest}
                    label={t("addPlan")}
                    className="rounded-full bg-gold px-7 py-4 text-[15px] font-medium text-[#061C1D] hover:bg-od"
                  />
                  <a
                    href={waSimple}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2.5 rounded-full border border-od/22 px-6.5 py-4 text-[15px] text-od hover:border-gold hover:bg-gold/12"
                  >
                    <span className="h-2 w-2 flex-none rounded-full bg-green" />
                    {t("ctaWa")}
                  </a>
                </div>
              </div>
              <div className="relative min-h-[260px] overflow-hidden rounded-[22px] border border-od/14 shadow-2xl sm:min-h-[380px]">
                <SiteImage file={destPhoto(slug, 0)} alt={d.photos[0]} priority />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bg px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-9 sm:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-5.5">
              <p className="text-lg leading-relaxed text-ink">{d.intro1[l]}</p>
              <p className="text-base leading-relaxed text-ink/72">{d.intro2[l]}</p>
            </div>
            <aside className="h-fit rounded-[20px] border border-line bg-surface p-7">
              <h2 className="font-mono text-[10px] tracking-[0.22em] text-terra uppercase">
                {t("practicalH")}
              </h2>
              <dl className="mt-3.5 flex flex-col">
                {d.facts[l].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 border-b border-line py-3.5 last:border-none"
                  >
                    <dt className="text-[13.5px] text-ink/50">{k}</dt>
                    <dd className="text-right text-[14.5px]">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4.5 text-[13px] leading-relaxed text-ink/50">
                {t("langNote")}
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-bg-alt px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-[20ch] font-serif text-3xl leading-tight font-normal tracking-tight sm:text-5xl">
              {t("highlightsH")}
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {d.hi.map((h, i) => (
                <article
                  key={i}
                  className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-6.5 transition-transform hover:-translate-y-1.5"
                >
                  <span
                    className="font-mono text-[10px] tracking-[0.22em]"
                    style={{ color: d.tint }}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-[24px] leading-tight font-normal">
                    {h[l][0]}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-ink/72">{h[l][1]}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-3.5 sm:grid-cols-3">
              {d.photos.slice(1).map((photo, i) => (
                <div
                  key={photo}
                  className={`relative min-h-[240px] overflow-hidden rounded-[18px] ${
                    i === 1 ? "sm:mt-9" : ""
                  }`}
                >
                  <SiteImage
                    file={destPhoto(slug, (i + 1) as 1 | 2 | 3)}
                    alt={photo}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <TripPlanner
          kicker={t("navPlanner")}
          heading={`${t("plannerHereH")} ${d.short[l]}`}
          lede={t("plannerHereB")}
        />

        <section className="bg-bg px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <h2 className="font-serif text-3xl leading-tight font-normal sm:text-5xl">
                {t("nearbyH")}
              </h2>
              <Link
                href="/tours"
                className="font-mono text-[11px] tracking-[0.16em] text-terra uppercase"
              >
                {t("exploreAll")}
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {d.nearby.map((nearbySlug) => {
                const n = DESTINATIONS[nearbySlug];
                return (
                  <Link
                    key={nearbySlug}
                    href={`/destinations/${nearbySlug}`}
                    className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface text-ink transition-transform hover:-translate-y-1.5"
                  >
                    <span className="relative block min-h-[200px]">
                      <SiteImage file={destPhoto(nearbySlug, 0)} alt={n.photos[0]} />
                    </span>
                    <span className="flex flex-col gap-2 p-6.5">
                      <span
                        className="font-mono text-[10px] tracking-[0.2em] uppercase"
                        style={{ color: n.tint }}
                      >
                        {REGIONS[n.region].label[l]}
                      </span>
                      <span className="font-serif text-2xl leading-tight">
                        {n.name[l]}
                      </span>
                      <span className="text-sm leading-relaxed text-ink/72">
                        {n.tagline[l]}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

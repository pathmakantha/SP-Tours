import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Photo } from "@/components/photo";
import { StarterGrid } from "@/components/starter-grid";
import { TripPlanner } from "@/components/trip-planner";
import { destList } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

const PAD = "px-[clamp(14px,3vw,40px)]";
const KICKER = "text-sm font-bold text-accent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return { title: `${t("toursH")} — SP Tours`, description: t("toursLede") };
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const t = await getTranslations("site");
  const dests = destList(locale);
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SP Tours destinations",
    itemListElement: dests.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "TouristDestination", name: d.name },
    })),
  };

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
        <section
          aria-labelledby="tours-h"
          className={`${PAD} pt-[clamp(120px,16vh,160px)]`}
        >
          <div className="mx-auto max-w-[1240px]">
            <p className={KICKER}>{t("regKicker")}</p>
            <h1
              id="tours-h"
              className="mt-2.5 max-w-[20ch] text-[clamp(36px,5vw,64px)] leading-[1.05] font-extrabold tracking-[-0.035em]"
            >
              {t("toursH")}
            </h1>
            <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-ink/72">
              {t("toursLede")}
            </p>
          </div>
        </section>

        <section
          aria-labelledby="tours-h"
          className={`${PAD} pt-[clamp(36px,5vh,56px)]`}
        >
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
            {dests.map((d) => (
              <Link
                key={d.slug}
                href={d.href}
                className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:text-ink hover:shadow-[0_24px_48px_-28px_var(--shadow)]"
              >
                <div className="relative aspect-[4/3]">
                  <Photo
                    label={d.photo}
                    sizes="(min-width: 1240px) 400px, (min-width: 680px) 50vw, 100vw"
                  />
                  <span className="pointer-events-none absolute top-3 left-3 rounded-lg bg-white/92 px-2.5 py-1.5 text-xs font-bold text-[#0E1B1D]">
                    {d.region}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4.5 pt-4.5 pb-5">
                  <h2 className="text-[21px] leading-[1.2] font-extrabold tracking-[-0.02em]">
                    {d.name}
                  </h2>
                  <p className="text-[14.5px] leading-[1.55] text-ink/72">
                    {d.tagline}
                  </p>
                  <dl className="mt-1.5 flex flex-wrap gap-x-4.5 gap-y-1.5 border-t border-line pt-3 text-[13px]">
                    <div className="flex gap-1.25">
                      <dt className="text-ink/58">{d.bestKey}:</dt>
                      <dd className="font-semibold">{d.best}</dd>
                    </div>
                    <div className="flex gap-1.25">
                      <dt className="text-ink/58">{d.stayKey}:</dt>
                      <dd className="font-semibold">{d.stay}</dd>
                    </div>
                  </dl>
                  <span className="mt-auto pt-2 text-[14.5px] font-bold text-accent">
                    {d.short} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-[1240px] text-[13.5px] text-ink/58">
            {t("toursNote")}
          </p>
        </section>

        <section
          id="itineraries"
          aria-labelledby="itin-h"
          className={`${PAD} py-[clamp(72px,10vh,120px)]`}
        >
          <div className="mx-auto max-w-[1240px]">
            <p className={KICKER}>{t("startersK")}</p>
            <h2
              id="itin-h"
              className="mt-2 max-w-[24ch] text-[clamp(28px,3.4vw,44px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
            >
              {t("startersH")}
            </h2>
            <p className="mt-3 max-w-[56ch] text-base leading-[1.6] text-ink/72">
              {t("startersB")}
            </p>
            <StarterGrid variant="list" />
          </div>
        </section>

        <TripPlanner />
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

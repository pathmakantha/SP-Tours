import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { PlaceholderImage } from "@/components/placeholder-image";
import { AddPlanButton } from "@/components/add-plan-button";
import { TripPlanner } from "@/components/trip-planner";
import { destList } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

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
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");
  const dests = destList((await getLocale()) as Locale);
  const waSimple = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <>
      <SiteHeader />
      <main className="pt-[62px]">
        <section className="bg-deep px-4 py-20 text-od sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-od/50 uppercase"
            >
              <Link href="/" className="hover:text-gold">
                {t("navHome")}
              </Link>
              <span>/</span>
              <span className="text-gold">{t("navDest")}</span>
            </nav>
            <h1 className="mt-7 max-w-[22ch] font-serif text-5xl leading-[0.98] font-normal tracking-tight sm:text-7xl">
              {t("toursH")}
            </h1>
            <p className="mt-5.5 max-w-[52ch] text-base leading-relaxed text-od/72 sm:text-lg">
              {t("toursLede")}
            </p>
            <p className="mt-4.5 font-mono text-[11px] tracking-[0.16em] text-gold uppercase">
              {t("toursNote")}
            </p>
          </div>
        </section>

        <section className="bg-bg px-4 pt-10 pb-16 sm:px-8 sm:pb-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dests.map((d) => (
              <article
                key={d.slug}
                className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition-transform hover:-translate-y-1.5"
              >
                <div className="relative min-h-[220px]">
                  <PlaceholderImage label={d.photo} />
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <p
                    className="font-mono text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: d.tint }}
                  >
                    {d.region}
                  </p>
                  <h2 className="font-serif text-2xl leading-tight font-normal">
                    {d.name}
                  </h2>
                  <p className="text-[14.5px] leading-relaxed text-ink/72">
                    {d.tagline}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-ink/50 uppercase">
                    {t("stayK")} · {d.stay}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2.5 pt-4">
                    <Link
                      href={`/destinations/${d.slug}`}
                      className="rounded-full bg-deep2 px-5 py-3 text-[13.5px] tracking-[0.03em] text-od hover:bg-terra"
                    >
                      {t("navDest")}
                    </Link>
                    <AddPlanButton
                      interestId={d.interest}
                      label={t("addPlan")}
                      className="rounded-full border border-line-2 px-5 py-3 text-[13.5px] hover:border-ink"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <TripPlanner />
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SiteImage } from "@/components/site-image";
import { destList } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";
import { destPhoto } from "@/lib/photos";
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
      <SiteHeader variant="tours" />
      <main className="pt-[62px]">
        <section className="bg-deep px-4 pt-14 pb-14 text-od sm:px-8 sm:pt-16 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.24em] text-gold uppercase">
              {t("navTours")}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.02] font-normal sm:text-6xl">
              {t("toursH")}
            </h1>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-od/72">
              {t("toursLede")}
            </p>
          </div>
        </section>

        <section className="bg-bg px-4 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dests.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface text-ink transition-transform hover:-translate-y-1.5"
              >
                <div className="relative min-h-[210px]">
                  <SiteImage file={destPhoto(d.slug, 0)} alt={d.name} />
                </div>
                <div className="p-5.5">
                  <p
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: d.tint }}
                  >
                    {d.region}
                  </p>
                  <h2 className="mt-2.5 font-serif text-2xl leading-tight font-normal">
                    {d.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/72">
                    {d.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-6xl text-[13px] text-ink/50">
            {t("toursNote")}
          </p>
        </section>
      </main>
      <MinimalFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Photo } from "@/components/photo";
import { TripPlanner } from "@/components/trip-planner";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return { title: `${t("navAbout")} — SP Tours`, description: t("aboutLede") };
}

export default async function AboutPage({
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
      <main className="pt-[62px]">
        <section className="bg-deep px-4 py-20 text-od sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-od/50 uppercase"
            >
              <Link href="/" className="hover:text-gold-t">
                {t("navHome")}
              </Link>
              <span>/</span>
              <span className="text-gold-t">{t("navAbout")}</span>
            </nav>
            <div className="mt-7 grid gap-9 lg:grid-cols-2 lg:items-end">
              <h1 className="max-w-[20ch] font-serif text-5xl leading-[0.98] font-normal tracking-tight sm:text-7xl">
                {t("aboutH")}
              </h1>
              <p className="max-w-[48ch] text-base leading-relaxed text-od/72 sm:text-lg">
                {t("aboutLede")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              {(
                [
                  ["aboutS1H", "aboutS1B", "border-ink"],
                  ["aboutS2H", "aboutS2B", "border-line-2"],
                  ["aboutS3H", "aboutS3B", "border-line-2"],
                ] as const
              ).map(([h, b, border]) => (
                <article key={h} className={`flex flex-col gap-2.5 border-t-2 pt-5.5 ${border}`}>
                  <h2 className="font-serif text-[28px] leading-tight font-normal">
                    {t(h)}
                  </h2>
                  <p className="text-base leading-relaxed text-ink/72">{t(b)}</p>
                </article>
              ))}
            </div>
            <div className="flex flex-col gap-5">
              <figure className="relative min-h-[300px] overflow-hidden rounded-[22px] sm:min-h-[400px]">
                <Photo label="The team with the car" />
              </figure>
              <ul className="flex list-none flex-col overflow-hidden rounded-2xl border border-line bg-surface p-0">
                {(["aboutV1", "aboutV2", "aboutV3", "aboutV4"] as const).map(
                  (v, i, arr) => (
                    <li
                      key={v}
                      className={`px-5 py-4 text-[14.5px] ${
                        i < arr.length - 1 ? "border-b border-line" : ""
                      }`}
                    >
                      {t(v)}
                    </li>
                  ),
                )}
              </ul>
              <p className="text-[13.5px] leading-relaxed text-ink/50">
                {t("langNote")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg-alt px-4 py-16 sm:px-8 sm:py-24">
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
                <div key={ti} className={`border-t-2 pt-5.5 ${border}`}>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-terra">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 font-serif text-[27px] font-normal">{t(ti)}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/72">{t(b)}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <a
                href="#planner"
                className="rounded-full bg-deep2 px-7 py-4 text-[15px] font-medium text-od hover:bg-terra"
              >
                {t("aboutCta")}
              </a>
              <Link
                href="/tours"
                className="rounded-full border border-line-2 px-7 py-4 text-[15px] text-ink hover:border-ink"
              >
                {t("allDest")}
              </Link>
            </div>
          </div>
        </section>

        <TripPlanner />
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

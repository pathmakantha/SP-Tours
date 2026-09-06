import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { MinimalFooter } from "@/components/minimal-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SiteImage } from "@/components/site-image";
import { ABOUT_TEAM_PHOTO } from "@/lib/photos";
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
      <SiteHeader variant="about" />
      <main className="pt-[62px]">
        <section className="bg-deep px-4 pt-14 pb-14 text-od sm:px-8 sm:pt-16 sm:pb-20">
          <div className="mx-auto grid max-w-5xl items-center gap-9 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] tracking-[0.24em] text-gold uppercase">
                {t("navAbout")}
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.02] font-normal sm:text-6xl">
                {t("aboutH")}
              </h1>
              <p className="mt-5 max-w-[52ch] text-[16.5px] leading-relaxed text-od/72">
                {t("aboutLede")}
              </p>
            </div>
            <div className="relative min-h-[260px] overflow-hidden rounded-[20px] sm:min-h-[380px]">
              <SiteImage
                file={ABOUT_TEAM_PHOTO}
                alt="Driver-guide and car on the road, Sri Lanka"
                priority
              />
            </div>
          </div>
        </section>

        <section className="bg-bg px-4 py-14 sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-3xl flex-col gap-9 sm:gap-14">
            {(
              [
                ["aboutS1H", "aboutS1B"],
                ["aboutS2H", "aboutS2B"],
                ["aboutS3H", "aboutS3B"],
              ] as const
            ).map(([h, b]) => (
              <div key={h}>
                <h2 className="font-serif text-[26px] leading-tight font-normal sm:text-[34px]">
                  {t(h)}
                </h2>
                <p className="mt-3.5 text-base leading-relaxed text-ink/72">
                  {t(b)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-bg-alt px-4 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4.5 sm:grid-cols-2">
            {(["aboutV1", "aboutV2", "aboutV3", "aboutV4"] as const).map((v) => (
              <div
                key={v}
                className="rounded-2xl border border-line bg-surface p-5.5 text-[15px] leading-relaxed"
              >
                {t(v)}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-5.5 max-w-4xl text-[13px] text-ink/50">
            {t("langNote")}
          </p>
        </section>

        <section className="bg-deep2 px-4 py-14 text-center text-od sm:px-8 sm:py-24">
          <h2 className="mx-auto max-w-[26ch] font-serif text-3xl leading-tight font-normal sm:text-5xl">
            {t("ftH")}
          </h2>
          <Link
            href="/#planner"
            className="mt-6.5 inline-flex rounded-full bg-gold px-7 py-4 text-[15px] font-medium text-[#061C1D] hover:bg-od"
          >
            {t("aboutCta")} →
          </Link>
        </section>
      </main>
      <MinimalFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

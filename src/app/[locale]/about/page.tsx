import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Photo } from "@/components/photo";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

const PAD = "px-[clamp(14px,3vw,40px)]";

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

  const story = [
    ["aboutS1H", "aboutS1B"],
    ["aboutS2H", "aboutS2B"],
    ["aboutS3H", "aboutS3B"],
  ] as const;

  const values = ["aboutV1", "aboutV2", "aboutV3", "aboutV4"] as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    about: {
      "@type": "TravelAgency",
      name: "SP Tours",
      areaServed: { "@type": "Country", name: "Sri Lanka" },
    },
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
          aria-labelledby="about-h"
          className={`${PAD} pt-[clamp(108px,14vh,140px)]`}
        >
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(28px,4vw,64px)]">
            <div>
              <p className="text-sm font-bold text-accent">{t("navAbout")}</p>
              <h1
                id="about-h"
                className="mt-2.5 max-w-[16ch] text-[clamp(36px,5vw,66px)] leading-[1.04] font-extrabold tracking-[-0.035em]"
              >
                {t("aboutH")}
              </h1>
              <p className="mt-4.5 max-w-[54ch] text-[17px] leading-[1.65] text-ink/72">
                {t("aboutLede")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/#planner"
                  className="flex min-h-[52px] items-center rounded-xl bg-accent px-5.5 text-[15px] font-bold text-accent-ink transition-[filter] hover:text-accent-ink hover:brightness-110"
                >
                  {t("aboutCta")} →
                </Link>
                <a
                  href={waSimple}
                  target="_blank"
                  rel="noopener"
                  className="flex min-h-[52px] items-center gap-2.25 rounded-xl border-[1.5px] border-line-2 px-5 text-[15px] font-bold text-ink hover:border-accent hover:text-ink"
                >
                  <span className="h-2 w-2 flex-none rounded-full bg-[#1E7A48]" />
                  {t("ctaWa")}
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/5] max-h-[640px] overflow-hidden rounded-3xl">
              <Photo
                label="Street kottu being cooked, 3:2"
                sizes="(min-width: 1024px) 600px, 100vw"
                priority
              />
            </div>
          </div>
        </section>

        <section aria-label={t("navAbout")} className={`${PAD} pt-[clamp(72px,10vh,120px)]`}>
          <ol className="mx-auto grid max-w-[1240px] list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4.5 p-0">
            {story.map(([h, b], i) => (
              <li
                key={h}
                className="flex flex-col gap-3 rounded-[18px] bg-bg-alt p-7"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-base font-extrabold text-accent-ink">
                  {i + 1}
                </span>
                <h2 className="text-[21px] font-extrabold tracking-[-0.02em]">
                  {t(h)}
                </h2>
                <p className="text-[15.5px] leading-[1.65] text-ink/72">
                  {t(b)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="values-h"
          className={`${PAD} pt-[clamp(72px,10vh,120px)]`}
        >
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(28px,4vw,64px)]">
            <div>
              <h2
                id="values-h"
                className="max-w-[18ch] text-[clamp(28px,3.4vw,44px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
              >
                {t("whyL1")} {t("whyL2")}
                {t("whyL3")}
              </h2>
              <p className="mt-3.5 max-w-[52ch] text-base leading-[1.65] text-ink/72">
                {t("whyBody")}
              </p>
              <p className="mt-4.5 text-[14.5px] font-semibold text-ink/72">
                {t("langNote")}
              </p>
            </div>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {values.map((v) => (
                <li
                  key={v}
                  className="flex min-h-16 items-center gap-3.5 rounded-[14px] border border-line bg-surface px-4.5 py-3.5 text-base font-semibold"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-soft text-sm font-extrabold text-accent"
                  >
                    ✓
                  </span>
                  {t(v)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat href={waSimple} />
    </>
  );
}

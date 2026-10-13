import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/site-header";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_TEL,
  WHATSAPP_NUMBER,
} from "@/lib/config";
import { allCredits } from "@/lib/photos";
import { destList } from "@/lib/site-data";
import { waSimpleHref } from "@/lib/trip-planner";
import type { Locale } from "@/i18n/routing";

const HEAD_CLASS = "text-[13px] font-bold text-ink/58";
const LIST_CLASS = "mt-3 flex flex-col gap-2.5 text-[15px]";
const LINK_CLASS = "text-ink hover:text-accent";

export async function SiteFooter() {
  const t = await getTranslations("site");
  const locale = (await getLocale()) as Locale;
  const waHref = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });
  const dests = destList(locale);

  return (
    <>
      {/* Closing call to action */}
      <section
        aria-labelledby="cta-h"
        className="px-[clamp(10px,2vw,28px)] pt-[clamp(72px,10vh,120px)] pb-[clamp(10px,2vw,28px)]"
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 rounded-[clamp(18px,2vw,28px)] bg-[#0B6E69] p-[clamp(32px,5vw,64px)] text-white">
          <div>
            <h2
              id="cta-h"
              className="max-w-[20ch] text-[clamp(28px,3.6vw,48px)] leading-[1.08] font-extrabold tracking-[-0.03em]"
            >
              {t("ftH")}
            </h2>
            <p className="mt-3 text-base text-white/86">{t("ftReply")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              className="flex min-h-[54px] items-center gap-2.5 rounded-xl bg-white px-6 text-base font-bold text-[#0B6E69] hover:text-[#0E1B1D]"
            >
              <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#1E7A48]" />
              {t("ftCta")}
            </a>
            <a
              href={`tel:${CONTACT_TEL}`}
              className="flex min-h-[54px] items-center rounded-xl border-[1.5px] border-white/60 px-5.5 text-base font-bold text-white hover:border-white hover:text-white"
            >
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="px-[clamp(14px,3vw,40px)] pt-[clamp(48px,7vh,72px)] pb-8"
      >
        <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-8">
          <div>
            <p className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-0.02em]">
              <BrandMark size={24} />
              SP Tours
            </p>
            <p className="mt-3 max-w-[30ch] text-sm leading-[1.6] text-ink/72">
              {t("ftLangs")}
            </p>
          </div>
          <div>
            <p className={HEAD_CLASS}>{t("ftExplore")}</p>
            <nav aria-label="Footer" className={LIST_CLASS}>
              <Link href="/tours" className={LINK_CLASS}>
                {t("navTours")}
              </Link>
              <Link href="/#planner" className={LINK_CLASS}>
                {t("navPlanner")}
              </Link>
              <Link href="/about" className={LINK_CLASS}>
                {t("navAbout")}
              </Link>
              <Link href="/#faq" className={LINK_CLASS}>
                FAQ
              </Link>
            </nav>
          </div>
          <div>
            <p className={HEAD_CLASS}>{t("navDest")}</p>
            <div className={LIST_CLASS}>
              {dests.map((d) => (
                <Link key={d.slug} href={d.href} className={LINK_CLASS}>
                  {d.short}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className={HEAD_CLASS}>{t("ftContact")}</p>
            <div className={LIST_CLASS}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                className={LINK_CLASS}
              >
                WhatsApp +{WHATSAPP_NUMBER}
              </a>
              <a href={`tel:${CONTACT_TEL}`} className={LINK_CLASS}>
                {CONTACT_PHONE}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASS}>
                {CONTACT_EMAIL}
              </a>
              <span className="text-ink/72">{t("ftCity")}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1240px] border-t border-line pt-5 text-[13px] text-ink/58">
          <p>{t("ftLegal")}</p>
          <details className="mt-3">
            <summary className="w-fit cursor-pointer list-none font-semibold hover:text-ink">
              {t("photoCredits")}
            </summary>
            <ul className="mt-3 grid list-none gap-1.5 p-0 text-xs sm:grid-cols-2">
              {allCredits().map((c) => (
                <li key={c.key}>
                  <a
                    href={c.source}
                    target="_blank"
                    rel="noopener"
                    className="text-ink/72 underline hover:text-ink"
                  >
                    {c.title.replace(/\.[a-z]+$/i, "")}
                  </a>
                  {" · "}
                  {c.author} ·{" "}
                  {c.licenseUrl ? (
                    <a
                      href={c.licenseUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-ink/72 underline hover:text-ink"
                    >
                      {c.license}
                    </a>
                  ) : (
                    c.license
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </footer>
    </>
  );
}

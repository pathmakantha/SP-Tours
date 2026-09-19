import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_TEL,
  WHATSAPP_NUMBER,
} from "@/lib/config";
import { allCredits } from "@/lib/photos";
import { waSimpleHref } from "@/lib/trip-planner";

const LINK_CLASS = "text-[15px] text-od/72 hover:text-od";

export async function SiteFooter() {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <footer
      id="contact"
      className="bg-deep px-4 pt-[clamp(72px,11vh,130px)] pb-10 text-od sm:px-[clamp(16px,4vw,56px)]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-start gap-[clamp(28px,4vw,60px)]">
          <div>
            <h2 className="max-w-[20ch] font-serif text-[clamp(32px,4.4vw,60px)] leading-[1.02] font-normal">
              {t("ftH")}
            </h2>
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              className="mt-7.5 inline-flex items-center gap-3 rounded-full bg-green px-7.5 py-4.5 text-base font-medium text-green-ink hover:bg-gold hover:text-green-ink"
            >
              {t("ftCta")}
            </a>
            <p className="mt-4 text-[13px] text-od/50">{t("ftReply")}</p>
          </div>

          <div className="grid gap-5.5">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-gold-t uppercase">
                {t("ftContact")}
              </p>
              <p className="mt-2.5 text-[15px] leading-[1.7] text-od/72">
                WhatsApp{" "}
                <a
                  href={waHref}
                  className="border-b border-gold/50 text-od hover:text-od"
                >
                  +{WHATSAPP_NUMBER}
                </a>
                <br />
                <a href={`tel:${CONTACT_TEL}`} className="text-od hover:text-od">
                  {CONTACT_PHONE}
                </a>
                <br />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-od hover:text-od"
                >
                  {CONTACT_EMAIL}
                </a>
                <br />
                {t("ftCity")}
              </p>
              <p className="mt-2.5 text-[13px] text-od/50">{t("ftLangs")}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] text-gold-t uppercase">
                {t("ftExplore")}
              </p>
              <nav aria-label="Footer" className="mt-2.5 flex flex-col gap-2">
                <Link href="/tours" className={LINK_CLASS}>
                  {t("navTours")}
                </Link>
                <Link href="/about" className={LINK_CLASS}>
                  {t("navAbout")}
                </Link>
                <Link href="/#planner" className={LINK_CLASS}>
                  {t("navPlanner")}
                </Link>
                <Link href="/#gallery" className={LINK_CLASS}>
                  {t("navGallery")}
                </Link>
                <Link href="/#faq" className={LINK_CLASS}>
                  FAQ
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <details className="mt-[clamp(44px,7vh,80px)] border-t border-od/14 pt-5.5 text-xs text-od/50">
          <summary className="w-fit cursor-pointer tracking-[0.06em]">
            {t("photoCredits")}
          </summary>
          <ul className="mt-3 grid list-none gap-1.5 p-0 sm:grid-cols-2">
            {allCredits().map((c) => (
              <li key={c.key}>
                <a
                  href={c.source}
                  target="_blank"
                  rel="noopener"
                  className="text-od/72 underline hover:text-od"
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
                    className="text-od/72 underline hover:text-od"
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
        <p className="mt-6 text-xs tracking-[0.06em] text-od/42">
          {t("ftLegal")}
        </p>
      </div>
    </footer>
  );
}

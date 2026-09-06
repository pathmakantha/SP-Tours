import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site-data";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

/** Rich footer used only on the Home page. Every other page uses MinimalFooter. */
export async function SiteFooter() {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  return (
    <footer
      id="contact"
      className="bg-deep px-4 pt-16 pb-10 text-od sm:px-8 sm:pt-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:gap-14">
        <div>
          <h2 className="max-w-[20ch] font-serif text-4xl leading-[1.02] font-normal sm:text-5xl">
            {t("ftH")}
          </h2>
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-green px-7 py-4 text-base font-medium text-green-ink shadow-[0_22px_44px_-22px_rgba(95,169,127,0.6)] hover:bg-gold"
          >
            {t("ftCta")}
          </a>
          <p className="mt-4 text-[13px] text-od/50">{t("ftReply")}</p>
        </div>

        <div className="grid gap-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
              {t("ftContact")}
            </p>
            <p className="mt-2.5 text-[15px] leading-[1.7] text-od/72">
              WhatsApp{" "}
              <a href={waHref} className="border-b border-gold/50 text-od">
                +{WHATSAPP_NUMBER}
              </a>
              <br />
              <a href={`tel:${CONTACT.tel}`} className="text-od">
                {CONTACT.phone}
              </a>
              <br />
              <a href={`mailto:${CONTACT.email}`} className="text-od">
                {CONTACT.email}
              </a>
              <br />
              {t("ftCity")}
            </p>
            <p className="mt-2.5 text-[13px] text-od/50">{t("ftLangs")}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">
              {t("ftExplore")}
            </p>
            <nav aria-label="Footer" className="mt-2.5 flex flex-col gap-2">
              <Link href="/tours" className="text-[15px] text-od/72 hover:text-od">
                {t("navTours")}
              </Link>
              <Link href="/about" className="text-[15px] text-od/72 hover:text-od">
                {t("navAbout")}
              </Link>
              <a href="#planner" className="text-[15px] text-od/72 hover:text-od">
                {t("navPlanner")}
              </a>
              <a href="#gallery" className="text-[15px] text-od/72 hover:text-od">
                {t("navGallery")}
              </a>
              <a href="#faq" className="text-[15px] text-od/72 hover:text-od">
                FAQ
              </a>
            </nav>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-14 flex max-w-6xl flex-wrap items-baseline justify-between gap-3 border-t border-od/14 pt-5 text-xs tracking-[0.06em] text-od/42 sm:mt-20">
        <span>{t("ftLegal")}</span>
        <Link href="/credits" className="text-od/42 hover:text-od/70">
          Photo credits
        </Link>
      </p>
    </footer>
  );
}

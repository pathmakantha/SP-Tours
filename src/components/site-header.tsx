import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

const NAV_CLASS =
  "hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od min-[1080px]:block";

export async function SiteHeader() {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, {
    waSimple: t("waSimple"),
  });

  const mobileLinks = [
    { href: "/tours", label: t("navTours") },
    { href: "/#why", label: t("navWhy") },
    { href: "/#planner", label: t("navPlanner") },
    { href: "/about", label: t("navAbout") },
    { href: "/#gallery", label: t("navGallery") },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-3.5 border-b border-od/14 bg-deep/82 px-3 py-3 backdrop-blur-md sm:px-[clamp(12px,4vw,56px)]">
      <Link
        href="/"
        className="flex flex-none items-center gap-[11px] text-od hover:text-od"
      >
        <span className="relative block h-[25px] w-[25px] flex-none rounded-full bg-gold">
          <span className="absolute inset-x-[-4px] top-[64%] h-[1.5px] bg-deep" />
        </span>
        <span className="flex items-baseline gap-2.5">
          <span className="font-serif text-[clamp(20px,4vw,26px)] leading-none tracking-[0.01em]">
            SP Tours
          </span>
          <span className="text-[9px] tracking-[0.24em] text-gold-t uppercase">
            {t("brandTag")}
          </span>
        </span>
      </Link>

      <nav
        aria-label="Primary"
        className="flex items-center gap-[clamp(8px,1.6vw,26px)]"
      >
        <Link href="/tours" className={NAV_CLASS}>
          {t("navTours")}
        </Link>
        <Link href="/#why" className={NAV_CLASS}>
          {t("navWhy")}
        </Link>
        <Link href="/about" className={NAV_CLASS}>
          {t("navAbout")}
        </Link>
        <Link href="/#faq" className={NAV_CLASS}>
          FAQ
        </Link>

        <LanguageSwitcher />

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="hidden rounded-full border border-gold/55 bg-gold/16 px-4.5 py-2.25 text-[13px] tracking-[0.06em] text-od transition-colors hover:bg-gold hover:text-[#1A1206] min-[1080px]:block"
        >
          {t("navWa")}
        </a>

        <ThemeToggle />

        <MobileMenu
          links={mobileLinks}
          waHref={waHref}
          waLabel={t("navWa")}
          openLabel={t("menuOpen")}
          closeLabel={t("menuClose")}
        />
      </nav>
    </header>
  );
}

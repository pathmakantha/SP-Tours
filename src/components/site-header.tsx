import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/logo-mark";
import { MobileMenu, type NavLink } from "@/components/mobile-menu";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

type HeaderVariant = "home" | "about" | "tours" | "destination";

export async function SiteHeader({
  variant = "about",
  plannerHash = "#planner",
}: {
  variant?: HeaderVariant;
  plannerHash?: string;
} = {}) {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, { waSimple: t("waSimple") });

  const home = { href: "/", label: t("navHome") };
  const tours = { href: "/tours", label: t("navTours") };
  const about = { href: "/about", label: t("navAbout") };
  const why = { href: "#why", label: t("navWhy") };
  const faq = { href: "#faq", label: "FAQ" };
  const gallery = { href: "#gallery", label: t("navGallery") };
  const planner = { href: plannerHash, label: t("navPlanner") };
  const plannerFromElsewhere = { href: `/${plannerHash}`, label: t("navPlanner") };

  let desktopLinks: NavLink[];
  let mobileLinks: NavLink[];
  let showWaButton = false;

  if (variant === "home") {
    desktopLinks = [tours, why, about, faq];
    mobileLinks = [tours, why, planner, about, gallery, faq];
    showWaButton = true;
  } else if (variant === "about") {
    desktopLinks = [home, tours];
    mobileLinks = [home, tours, plannerFromElsewhere];
  } else if (variant === "tours") {
    desktopLinks = [home, about];
    mobileLinks = [home, plannerFromElsewhere, about];
  } else {
    desktopLinks = [home, tours, about];
    mobileLinks = [home, tours, planner, about];
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-3.5 border-b border-od/14 bg-deep/82 px-4 py-3 backdrop-blur-md sm:px-8">
      <Link href="/" className="flex flex-none items-center gap-2.5 text-od">
        <LogoMark />
        <span className="flex items-baseline gap-2.5">
          <span className="font-serif text-xl leading-none sm:text-2xl">
            SP Tours
          </span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-gold uppercase">
            {t("brandTag")}
          </span>
        </span>
      </Link>

      <nav
        aria-label="Primary"
        className="flex items-center gap-2 sm:gap-4 lg:gap-6"
      >
        {desktopLinks.map((link) =>
          link.href.startsWith("#") ? (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {link.label}
            </Link>
          ),
        )}

        <LanguageSwitcher />

        {showWaButton && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="hidden rounded-full border border-gold/55 bg-gold/16 px-4.5 py-2.5 text-[13px] tracking-[0.06em] text-od transition-colors hover:bg-gold hover:text-[#061C1D] lg:block"
          >
            {t("navWa")}
          </a>
        )}

        <ThemeToggle />

        <MobileMenu links={mobileLinks} waHref={waHref} waLabel={t("navWa")} />
      </nav>
    </header>
  );
}

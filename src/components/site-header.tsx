import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

export async function SiteHeader({
  variant = "page",
}: {
  variant?: "home" | "page";
} = {}) {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, {
    waSimple: t("waSimple"),
  });

  const pageLinks: Array<{ href: "/" | "/tours" | "/about"; label: string }> = [
    { href: "/", label: t("navHome") },
    { href: "/tours", label: t("navTours") },
    { href: "/about", label: t("navAbout") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-3.5 border-b border-od/14 bg-deep/82 px-4 py-3 backdrop-blur-md sm:px-8">
      <Link
        href="/"
        className="flex flex-none items-baseline gap-2.5 text-od hover:text-od"
      >
        <span className="font-serif text-xl leading-none sm:text-2xl">
          SP Tours
        </span>
        <span className="font-mono text-[9px] tracking-[0.24em] text-gold uppercase">
          {t("brandTag")}
        </span>
      </Link>

      <nav
        aria-label="Primary"
        className="flex items-center gap-2 sm:gap-4 lg:gap-6"
      >
        {variant === "home" ? (
          <>
            <Link
              href="/tours"
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {t("navTours")}
            </Link>
            <a
              href="#why"
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {t("navWhy")}
            </a>
            <Link
              href="/about"
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {t("navAbout")}
            </Link>
            <a
              href="#gallery"
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {t("navGallery")}
            </a>
          </>
        ) : (
          <>
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#planner"
              className="hidden text-[13px] tracking-[0.08em] text-od/72 uppercase hover:text-od lg:block"
            >
              {t("navPlanner")}
            </a>
          </>
        )}

        <LanguageSwitcher />

        <a
          href={waHref}
          target="_blank"
          rel="noopener"
          className="hidden rounded-full border border-gold/55 bg-gold/16 px-4.5 py-2.5 text-[13px] tracking-[0.06em] text-od transition-colors hover:bg-gold hover:text-[#061C1D] lg:block"
        >
          {t("navWa")}
        </a>

        <ThemeToggle />
      </nav>
    </header>
  );
}

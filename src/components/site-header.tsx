import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeaderShell } from "@/components/header-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { waSimpleHref } from "@/lib/trip-planner";

const NAV_CLASS = "text-[15px] font-medium text-ink/72 hover:text-ink";

/** The gold sun-over-horizon mark used in the header and footer. */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <span
      className="relative block flex-none rounded-full bg-gold"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-x-[-4px] top-[64%] h-0.5 bg-bg" />
    </span>
  );
}

export async function SiteHeader() {
  const t = await getTranslations("site");
  const waHref = waSimpleHref(WHATSAPP_NUMBER, {
    waSimple: t("waSimple"),
  });

  const links = [
    { href: "/#destinations", label: t("navDest") },
    { href: "/tours", label: t("navTours") },
    { href: "/#planner", label: t("navPlanner") },
    { href: "/about", label: t("navAbout") },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <HeaderShell>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-[clamp(14px,3vw,40px)] py-3">
        <Link
          href="/"
          className="flex flex-none items-center gap-2.5 text-ink hover:text-ink"
        >
          <BrandMark />
          <span className="text-[19px] font-extrabold tracking-[-0.02em]">
            SP Tours
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-[clamp(18px,2.2vw,32px)] min-[1000px]:flex"
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className="hidden h-10 items-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-accent-ink hover:text-accent-ink hover:opacity-90 min-[1000px]:flex"
          >
            {t("navWa")}
          </a>
          <MobileMenu
            links={links}
            waHref={waHref}
            waLabel={t("navWa")}
            openLabel={t("menuOpen")}
            closeLabel={t("menuClose")}
          />
        </div>
      </div>
    </HeaderShell>
  );
}

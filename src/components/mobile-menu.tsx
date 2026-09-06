"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const MENU_ARIA: Record<Locale, { open: string; close: string }> = {
  en: { open: "Open menu", close: "Close menu" },
  de: { open: "Menü öffnen", close: "Menü schließen" },
  fr: { open: "Ouvrir le menu", close: "Fermer le menu" },
  ru: { open: "Открыть меню", close: "Закрыть меню" },
  zh: { open: "打开菜单", close: "关闭菜单" },
};

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export function MobileMenu({
  links,
  waHref,
  waLabel,
}: {
  links: NavLink[];
  waHref: string;
  waLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const aria = MENU_ARIA[locale] ?? MENU_ARIA.en;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? aria.close : aria.open}
        className="flex h-[38px] w-[38px] flex-none flex-col items-center justify-center gap-1 rounded-full border border-od/22 bg-transparent lg:hidden"
      >
        <span className="block h-[1.5px] w-[15px] bg-od" />
        <span className="block h-[1.5px] w-[15px] bg-od" />
        <span className="block h-[1.5px] w-[15px] bg-od" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-od/14 bg-deep shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col px-4 pt-2 pb-5 sm:px-8"
          >
            {links.map((link) =>
              link.external || link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-od/14 py-3.5 text-base tracking-[0.02em] text-od"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-od/14 py-3.5 text-base tracking-[0.02em] text-od"
                >
                  {link.label}
                </Link>
              ),
            )}
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="mt-4.5 flex items-center justify-center gap-2.5 rounded-full bg-green py-4 text-[15px] font-medium text-green-ink"
            >
              <span className="h-2.5 w-2.5 flex-none rounded-full bg-green-ink" />
              {waLabel}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

export interface MobileMenuLink {
  href: string;
  label: string;
}

export function MobileMenu({
  links,
  waHref,
  waLabel,
  openLabel,
  closeLabel,
}: {
  links: MobileMenuLink[];
  waHref: string;
  waLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[38px] w-[38px] flex-none flex-col items-center justify-center gap-1 rounded-full border border-od/22 min-[1080px]:hidden"
      >
        <span className="block h-[1.5px] w-[15px] bg-od" />
        <span className="block h-[1.5px] w-[15px] bg-od" />
        <span className="block h-[1.5px] w-[15px] bg-od" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-od/14 bg-deep shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] min-[1080px]:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col px-4 pt-2 pb-5 sm:px-8"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="border-b border-od/14 px-0.5 py-3.25 text-base tracking-[0.02em] text-od hover:text-od"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={close}
              className="mt-4.5 flex items-center justify-center gap-2.5 rounded-full bg-green p-4 text-[15px] font-medium text-green-ink hover:text-green-ink"
            >
              <span className="h-[9px] w-[9px] flex-none rounded-full bg-green-ink" />
              {waLabel}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

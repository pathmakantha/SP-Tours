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
        className="flex h-11 w-11 flex-none cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-line-2 bg-surface min-[1000px]:hidden"
      >
        <span className="block h-0.5 w-4 rounded-sm bg-ink" />
        <span className="block h-0.5 w-4 rounded-sm bg-ink" />
        <span className="block h-0.5 w-4 rounded-sm bg-ink" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-y border-line bg-bg shadow-[0_30px_60px_-30px_var(--shadow)] min-[1000px]:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col px-[clamp(14px,3vw,40px)] pt-1.5 pb-4.5"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="border-b border-line py-3.5 text-base font-semibold text-ink hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              onClick={close}
              className="mt-4 flex min-h-[50px] items-center justify-center rounded-xl bg-accent text-[15px] font-semibold text-accent-ink hover:text-accent-ink"
            >
              {waLabel}
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
